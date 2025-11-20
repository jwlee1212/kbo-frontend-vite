import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// 1. 재사용 가능한 테이블 컴포넌트 (모든 스탯 표시)
const RankingTable = ({ data, statsType }) => {
    
    // 1-A. 헤더: 투수/타자 헤더를 '최종' 업그레이드
   const headers = statsType === 'PITCHER'
        ? ['선수명', 'ERA', 'FIP', 'WHIP', 'K/9', 'BB/9', '승', '패', '세이브', '홀드', '이닝', '피안타', '자책점']
        : ['선수명', 'OPS', '타율', 'OBP', 'SLG', 'wRC', '타석', '타점', '득점', '홈런', '3루타', '2루타', '단타', '도루', '희생타', '희생번트', '사구'];
    // 1-B. 데이터: 투수/타자 데이터를 '최종' 업그레이드 (소수점 포함!)
    const getRowData = (player) => {
        if (statsType === 'PITCHER') {
            return [
                player.name, 
                (player.era ?? 0).toFixed(2), // ⬅️ 안전 장치 추가!
                (player.fip ?? 0).toFixed(2),
                (player.whip ?? 0).toFixed(2),
                (player.kPerNine ?? 0).toFixed(1),
                (player.bbPerNine ?? 0).toFixed(1),
                player.wins ?? 0,
                player.losses ?? 0,
                player.saves ?? 0,
                player.holds ?? 0,
                (player.inningsPitched ?? 0).toFixed(1),
                player.hitsAllowed ?? 0,
                player.earnedRuns ?? 0
            ];
        } else { // HITTER
            return [
                player.name, 
                (player.ops ?? 0).toFixed(3), // ⬅️ 안전 장치 추가!
                (player.battingAverage ?? 0).toFixed(3),
                (player.onBasePercentage ?? 0).toFixed(3),
                (player.sluggingPercentage ?? 0).toFixed(3),
                (player.wrc ?? 0).toFixed(1),
                player.plateAppearances ?? 0,
                player.rbi ?? 0,
                player.runs ?? 0,
                player.homeRunBat ?? 0,
                player.tripleBase ?? 0,
                player.doubleBase ?? 0,
                player.single ?? 0,
                player.stolenBases ?? 0,
                player.hitByPitchBat ?? 0,
                player.sacrificeFlies ?? 0, // ⬅️ SF 추가!
                player.sacrificeHits ?? 0,  // ⬅️ SH 추가!
              
            ];
        }
    };

    return (
        <table>
            <thead>
                <tr>
                    {headers.map(header => <th key={header}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map(player => (
                    <tr key={player.name}>
                        {getRowData(player).map((data, index) => (
                            // 메인 지표(두 번째 열: ERA 또는 OPS)만 빨간색 강조
                            <td 
                                key={index} 
                                style={index === 1 ? {fontWeight: 'bold', color: '#d32f2f'} : {}}>
                                {data}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// 2. (App 컴포넌트 메인 로직)
function App() {
  const [currentView, setCurrentView] = useState('PITCHER');
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // 3. ⚡️ '옛날 주소'가 아니라 '새 주소'로 '전화'를 겁니다! ⚡️
    const endpoint = currentView === 'PITCHER' 
        ? 'http://localhost:8080/api/pitching-ranking' // (O)
        : 'http://localhost:8080/api/hitting-ranking'; // (O)
        
    axios.get(endpoint)
      .then(response => {
        setRankingData(response.data);
      })
      .catch(error => {
        console.error("API 호출 중 오류 발생:", error);
        if (error.code !== 'ERR_CANCELED') {
            setError(error); 
        }
      })
      .finally(() => {
          setLoading(false);
      });
  }, [currentView]); // currentView가 바뀔 때마다 이 effect가 재실행됨

  return (
    <div className="App">
      <h1>KBO 통계 대시보드 (MVP v1.0)</h1>

      <div className="view-selector">
          <button 
              className={currentView === 'PITCHER' ? 'active' : ''}
              onClick={() => setCurrentView('PITCHER')}>
              투수 랭킹 (ERA)
          </button>
          <button 
              className={currentView === 'HITTER' ? 'active' : ''}
              onClick={() => setCurrentView('HITTER')}>
              타자 랭킹 (OPS)
          </button>
      </div>
      
      {loading && <h2>데이터를 불러오는 중입니다...</h2>}
      
      {error && (
        <div style={{ color: 'red', border: '2px solid red', padding: '10px' }}>
          <h2>🚨 API 호출 실패 🚨</h2>
          <p>엔진 기지(IntelliJ)가 켜져 있는지, 콘솔 오류가 없는지 확인하세요!</p>
        </div>
      )}
      
      {!loading && rankingData.length > 0 && (
          <RankingTable 
              data={rankingData} 
              statsType={currentView} 
          />
      )}
      
    </div>
  );
}

export default App;