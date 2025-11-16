import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// 1. 재사용 가능한 테이블 컴포넌트 생성
const RankingTable = ({ data, statsType }) => {
    // 투수/타자에 따라 테이블 헤더를 다르게 설정
    const headers = statsType === 'PITCHER'
        ? ['선수명', 'FIP', '이닝', '삼진', '볼넷', '피홈런']
        : ['선수명', 'wRC', '타석(PA)', '단타', '2루타', '3루타', '홈런'];

    const getRowData = (player) => {
        // 투수: FIP를 보여줌
        if (statsType === 'PITCHER') {
            return [
                player.name, 
                player.fip, 
                player.inningsPitched, 
                player.strikeouts, 
                player.walks, 
                player.homeRuns
            ];
        } else { // 타자: wRC+를 보여줌
            return [
                player.name, 
                player.wrc, 
                player.plateAppearances,
                player.single, 
                player.doubleBase, 
                player.tripleBase,
                player.homeRunBat
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
                            // index가 1일 때 (FIP 또는 wRC+ 값)만 강조 스타일 적용
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


function App() {
  // 2. '현재 선택된 뷰' 상태 관리: 'PITCHER' 또는 'HITTER'
  const [currentView, setCurrentView] = useState('PITCHER');
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 3. API 호출 로직: 뷰가 바뀔 때마다 실행됨
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // ⬅️ 님이 '백엔드'에서 새로 만드신 주소로 '전화'를 겁니다!
    const endpoint = currentView === 'PITCHER' 
        ? 'http://localhost:8080/api/pitching-ranking' // 투수 랭킹 주소
        : 'http://localhost:8080/api/hitting-ranking'; // 타자 랭킹 주소
        
    axios.get(endpoint)
      .then(response => {
        setRankingData(response.data);
      })
      .catch(error => {
        console.error("API 호출 중 오류 발생:", error);
        // 404 에러는 백엔드 코드가 작동 중이라는 뜻이므로 CORS 경고만 표시
        if (error.response && error.response.status === 404) {
             setError(new Error("API 엔드포인트 이름을 확인하세요! (404 Not Found)"));
        } else {
             setError(error);
        }
      })
      .finally(() => {
          setLoading(false);
      });
  }, [currentView]); // currentView가 바뀔 때마다 이 effect가 재실행됨

  
  // 4. '얼굴' 그리기
  return (
    <div className="App">
      <h1>KBO 통계 대시보드 (MVP v1.0)</h1>

      {/* 5. 화면 전환 버튼 */}
      <div className="view-selector">
          <button 
              className={currentView === 'PITCHER' ? 'active' : ''}
              onClick={() => setCurrentView('PITCHER')}>
              투수 랭킹 (FIP)
          </button>
          <button 
              className={currentView === 'HITTER' ? 'active' : ''}
              onClick={() => setCurrentView('HITTER')}>
              타자 랭킹 (wRC)
          </button>
      </div>

      {loading && <h2>데이터를 불러오는 중입니다...</h2>}
      
      {/* 6. 에러 처리 */}
      {error && (
        <div style={{ color: 'red', border: '2px solid red', padding: '10px' }}>
          <h2>🚨 API 호출 실패 🚨</h2>
          <p>{error.message}</p>
        </div>
      )}
      
      {/* 7. 랭킹 테이블 렌더링 */}
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