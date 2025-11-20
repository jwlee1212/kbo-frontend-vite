import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// 1. 재사용 가능한 테이블 컴포넌트
const RankingTable = ({ data, statsType }) => {
    
    const headers = statsType === 'PITCHER'
        // 투수 헤더: 주요 스탯 위주 (ERA, FIP, WHIP...)
        ? ['선수명', 'ERA', 'FIP', 'WHIP', 'K/BB', 'K/9', 'BB/9', '승', '패', '세이브', '홀드', '이닝', '자책점']
        
        // ⚡️ 타자 헤더: 님이 원하신 "메인(OPS) -> 클래식 -> 고급" 순서로 완벽 재배치! ⚡️
        : ['선수명', 'OPS', '타율', '홈런', '타점', '득점', '도루', 'wOBA', 'wRC', 'ISO', 'BABIP', 'GPA', 'PSN', 'OBP', 'SLG', '삼진', '볼넷'];

    const getRowData = (player) => {
        // ⚡️ 핵심: (값 ?? 0) <-- 이 안전장치가 '흰 화면 저주'를 막아줍니다! ⚡️
        if (statsType === 'PITCHER') {
            return [
                player.name, 
                (player.era ?? 0).toFixed(2),      // ERA (안전장치 OK)
                (player.fip ?? 0).toFixed(2),      // FIP
                (player.whip ?? 0).toFixed(2),     // WHIP
                (player.kbb ?? 0).toFixed(2),      // K/BB
                (player.kPerNine ?? 0).toFixed(1), // K/9
                (player.bbPerNine ?? 0).toFixed(1),// BB/9
                player.wins ?? 0,
                player.losses ?? 0,
                player.saves ?? 0,
                player.holds ?? 0,
                (player.inningsPitched ?? 0).toFixed(1),
                player.earnedRuns ?? 0
            ];
        } else { // HITTER (순서 재배치 + 안전장치 적용)
            return [
                player.name, 
                (player.ops ?? 0).toFixed(3),            // 1. OPS (메인)
                (player.battingAverage ?? 0).toFixed(3), // 2. 타율 (클래식 시작)
                player.homeRunBat ?? 0,                  // 3. 홈런
                player.rbi ?? 0,                         // 4. 타점
                player.runs ?? 0,                        // 5. 득점
                player.stolenBases ?? 0,                 // 6. 도루 (클래식 끝)
                
                (player.woba ?? 0).toFixed(3),           // 7. wOBA (고급 시작)
                (player.wrc ?? 0).toFixed(1),            // 8. wRC
                (player.iso ?? 0).toFixed(3),            // 9. ISO
                (player.babip ?? 0).toFixed(3),          // 10. BABIP
                (player.gpa ?? 0).toFixed(3),            // 11. GPA
                (player.psn ?? 0).toFixed(2),            // 12. PSN (고급 끝)
                
                (player.onBasePercentage ?? 0).toFixed(3), // 13. OBP (기타)
                (player.sluggingPercentage ?? 0).toFixed(3), // 14. SLG
                player.strikeoutsBat ?? 0,               // 15. 삼진
                player.walksBat ?? 0                     // 16. 볼넷
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
                            // 1번째 열(이름)과 2번째 열(메인 스탯) 강조
                            <td 
                                key={index} 
                                style={
                                    index === 1 ? {fontWeight: '800', color: '#d32f2f', fontSize: '1.1em'} : 
                                    index === 0 ? {fontWeight: 'bold', color: '#1a237e'} : {}
                                }>
                                {data}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

function App() {
  const [currentView, setCurrentView] = useState('PITCHER');
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    setRankingData([]); // 뷰 바뀔 때 데이터 초기화 (잔상 방지)

    const endpoint = currentView === 'PITCHER' 
        ? 'http://localhost:8080/api/pitching-ranking'
        : 'http://localhost:8080/api/hitting-ranking'; 
        
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
  }, [currentView]);

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
      
      {loading && <h2 style={{textAlign: 'center', padding: '20px'}}>데이터를 분석 중입니다...</h2>}
      
      {error && (
        <div style={{ color: 'red', border: '2px solid red', padding: '20px', margin: '20px', textAlign: 'center' }}>
          <h2>🚨 API 호출 실패 🚨</h2>
          <p>엔진 기지(IntelliJ)가 켜져 있는지 확인해주세요!</p>
          <p style={{fontSize: '0.8em', color: '#666'}}>{error.message}</p>
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