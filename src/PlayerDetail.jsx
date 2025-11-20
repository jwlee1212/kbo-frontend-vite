import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import './App.css';

const PlayerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/player/${id}`)
      .then(res => {
        console.log("상세 데이터 수신:", res.data); // ⚡️ 데이터 확인용 로그
        setPlayer(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("상세 페이지 에러:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading-screen">데이터 분석 중...</div>;
  if (!player) return <div className="error-screen">선수를 찾을 수 없습니다.</div>;

  const isPitcher = player.position === 'P';

  // ⚡️ [안전장치] 데이터가 없으면(undefined) 0으로 대체 (|| 0)
  const kPerNine = player.kPerNine || 0;
  const bbPerNine = player.bbPerNine || 0;
  const era = player.era || 0;
  const innings = player.inningsPitched || 0;
  const fip = player.fip || 0;
  
  const avg = player.battingAverage || 0;
  const iso = player.iso || 0;
  const bbk = player.bbk || 0;
  const psn = player.psn || 0;
  const wrc = player.wrc || 0;

  const chartData = isPitcher ? [
    { subject: '구위(K/9)', A: Math.min(kPerNine * 10, 100), fullMark: 100 },
    { subject: '제구(BB/9)', A: Math.max(100 - (bbPerNine * 20), 0), fullMark: 100 },
    { subject: '억제력(ERA)', A: Math.max(100 - (era * 15), 0), fullMark: 100 },
    { subject: '이닝', A: Math.min(innings / 2, 100), fullMark: 100 },
    { subject: 'FIP', A: Math.max(100 - (fip * 15), 0), fullMark: 100 },
  ] : [
    { subject: '정확(AVG)', A: avg * 250, fullMark: 100 },
    { subject: '파워(ISO)', A: iso * 300, fullMark: 100 },
    { subject: '선구안(BB/K)', A: Math.min(bbk * 100, 100), fullMark: 100 },
    { subject: '주루(Spd)', A: Math.min(psn * 5, 100), fullMark: 100 },
    { subject: '생산성(wRC)', A: Math.min(wrc / 1.5, 100), fullMark: 100 },
  ];

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>← 뒤로가기</button>

      <div className="player-header">
        <div className="player-title">
          <span className="position-badge">{player.position || '-'}</span>
          <h1>{player.name || '이름 없음'}</h1>
        </div>
        <div className="main-stat">
            {/* ⚡️ [핵심 수정] 여기서 에러가 났었습니다. 안전하게 (값 || 0).toFixed() 처리 */}
            {isPitcher ? 
                <><span>ERA</span> <strong>{(player.era || 0).toFixed(2)}</strong></> : 
                <><span>OPS</span> <strong>{(player.ops || 0).toFixed(3)}</strong></>
            }
        </div>
      </div>

      <div className="content-grid">
        <div className="chart-card">
          <h3>5-Tool Analysis</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={player.name}
                  dataKey="A"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-card">
            <h3>Season Stats</h3>
            <div className="stats-grid">
                {isPitcher ? (
                    <>
                        <StatItem label="이닝" value={(player.inningsPitched || 0).toFixed(1)} />
                        <StatItem label="삼진" value={player.strikeouts || 0} />
                        <StatItem label="볼넷" value={player.walks || 0} />
                        <StatItem label="WHIP" value={(player.whip || 0).toFixed(2)} />
                        <StatItem label="PFR" value={(player.pfr || 0).toFixed(2)} />
                        <StatItem label="FIP" value={(player.fip || 0).toFixed(2)} />
                    </>
                ) : (
                    <>
                        <StatItem label="타율" value={(player.battingAverage || 0).toFixed(3)} />
                        <StatItem label="홈런" value={player.homeRunBat || 0} />
                        <StatItem label="타점" value={player.rbi || 0} />
                        <StatItem label="도루" value={player.stolenBases || 0} />
                        <StatItem label="wOBA" value={(player.woba || 0).toFixed(3)} />
                        <StatItem label="wRC" value={(player.wrc || 0).toFixed(1)} />
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
    <div className="stat-item">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
    </div>
);

export default PlayerDetail;