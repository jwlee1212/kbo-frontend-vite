import { useState, useEffect } from 'react';
import axios from 'axios'; // 1. 방금 설치한 '전화기(axios)'
import './App.css';

function App() {
  // 2. '데이터'를 담을 '그릇'(state)을 만듭니다.
  const [rankingData, setRankingData] = useState([]);
  const [error, setError] = useState(null);

  // 3. '얼굴'이 '딱 1번'만 '엔진'에게 '전화'를 겁니다.
  useEffect(() => {
    axios.get('http://localhost:8080/api/fip-ranking') // 4. '엔진 기지' 주소!
      .then(response => {
        // 5. '전화'에 '성공'하면 -> '데이터'를 '그릇'에 담습니다.
        setRankingData(response.data);
      })
      .catch(error => {
        // 6. '전화'에 '실패'하면 -> '에러'를 '그릇'에 담습니다.
        console.error("API 호출 중 오류 발생:", error);
        setError(error); // (아마 '새로운 보스'가 뜰 겁니다!)
      });
  }, []); // '[]' : 딱 1번만 실행하라는 '주문'

  // 7. '얼굴'을 '그립니다'.
  return (
    <div className="App">
      <h1>KBO 투수 FIP 랭킹 (MVP v1.0)</h1>
      
      {/* '에러' 그릇에 '에러'가 담겼다면? */}
      {error && (
        <div style={{ color: 'red', border: '2px solid red', padding: '10px' }}>
          <h2>🚨 새로운 보스(CORS) 출현! 🚨</h2>
          <p>F12(개발자 도구) ➔ 'Console' 탭을 확인하세요!</p>
          <p>(예상 오류: 'Access-Control-Allow-Origin' ...)</p>
        </div>
      )}

      {/* '데이터' 그릇에 '데이터'가 담겼다면? */}
      <table>
        <thead>
          <tr>
            <th>선수명</th>
            <th>FIP</th>
            <th>이닝</th>
            <th>삼진</th>
            <th>볼넷</th>
            <th>피홈런</th>
          </tr>
        </thead>
        <tbody>
          {rankingData.map(player => (
            <tr key={player.name}>
              <td>{player.name}</td>
              <td>{player.fip}</td>
              <td>{player.inningsPitched}</td>
              <td>{player.strikeouts}</td>
              <td>{player.walks}</td>
              <td>{player.homeRuns}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;