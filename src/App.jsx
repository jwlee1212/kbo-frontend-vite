import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom'; // ⚡️ 추가

// 🛠️ 컬럼 설정 (Header Label과 실제 데이터 Key를 매핑)
const COLUMNS = {
    PITCHER: [
        { label: '선수명', key: 'name' },
        { label: '포지션', key: 'position' }, // ⚡️ 포지션 추가
        { label: 'ERA', key: 'era', main: true, format: v => v.toFixed(2) }, // main: 빨간색 강조
        { label: 'FIP', key: 'fip', format: v => v.toFixed(2) },
        { label: 'WHIP', key: 'whip', format: v => v.toFixed(2) },
        { label: 'K/9', key: 'kPerNine', format: v => v.toFixed(1) },
        { label: 'BB/9', key: 'bbPerNine', format: v => v.toFixed(1) },
        { label: 'PFR', key: 'pfr', format: v => v.toFixed(2) },
        { label: '승', key: 'wins' },
        { label: '패', key: 'losses' },
        { label: '세이브', key: 'saves' },
        { label: '홀드', key: 'holds' },
        { label: '이닝', key: 'inningsPitched', format: v => v.toFixed(1) },
        { label: '자책점', key: 'earnedRuns' }
    ],
    HITTER: [
        { label: '선수명', key: 'name' },
        { label: '포지션', key: 'position' }, // ⚡️ 포지션 추가
        { label: 'OPS', key: 'ops', main: true, format: v => v.toFixed(3) },
        { label: '타율', key: 'battingAverage', format: v => v.toFixed(3) },
        { label: '홈런', key: 'homeRunBat' },
        { label: '타점', key: 'rbi' },
        { label: '득점', key: 'runs' },
        { label: '도루', key: 'stolenBases' },
        { label: 'wOBA', key: 'woba', format: v => v.toFixed(3) },
        { label: 'wRC', key: 'wrc', format: v => v.toFixed(1) },
        { label: 'ISO', key: 'iso', format: v => v.toFixed(3) },
        { label: 'BABIP', key: 'babip', format: v => v.toFixed(3) },
        { label: 'GPA', key: 'gpa', format: v => v.toFixed(3) },
        { label: 'PSN', key: 'psn', format: v => v.toFixed(2) },
        { label: 'OBP', key: 'onBasePercentage', format: v => v.toFixed(3) },
        { label: 'SLG', key: 'sluggingPercentage', format: v => v.toFixed(3) },
        { label: '삼진', key: 'strikeoutsBat' },
        { label: '볼넷', key: 'walksBat' },
        { label: 'K/BB', key: 'kbb', format: v => v.toFixed(2) },
        { label: 'BB/K', key: 'bbk', format: v => v.toFixed(2) }
    ]
};

const RankingTable = ({ data, statsType }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');

    // 1. 정렬 핸들러
    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // 2. 데이터 필터링 & 정렬 로직
    const processedData = useMemo(() => {
        let sortedData = [...data];

        // (1) 검색 필터
        if (searchTerm) {
            sortedData = sortedData.filter(player => 
                player.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // (2) 정렬
        if (sortConfig.key) {
            sortedData.sort((a, b) => {
                const valA = a[sortConfig.key] ?? 0; // null/undefined 처리 (숫자 0으로)
                const valB = b[sortConfig.key] ?? 0;
                
                // 문자열 정렬 (이름, 포지션 등)
                if (typeof valA === 'string' && typeof valB === 'string') {
                    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                    return 0;
                }

                // 숫자 정렬
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortedData;
    }, [data, sortConfig, searchTerm]);

    const columns = COLUMNS[statsType];

    return (
        <div className="table-container">
            <div className="controls-container">
                <input 
                    type="text" 
                    placeholder="선수 이름 검색..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th 
                                key={col.key} 
                                onClick={() => handleSort(col.key)}
                                className={`sortable ${sortConfig.key === col.key ? sortConfig.direction : ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {processedData.length > 0 ? (
                        processedData.map((player) => (
                            <tr key={player.name}>
                                {columns.map((col) => {
                                    const value = player[col.key] ?? (col.key === 'position' ? '-' : 0); // 포지션 없을 땐 '-'
                                    return (
                                        <td 
                                            key={col.key}
                                            style={
                                                col.main ? { fontWeight: '800', color: '#d32f2f', fontSize: '1.1em' } :
                                                col.key === 'name' ? { fontWeight: 'bold', color: '#1a237e', textAlign: 'left' } : 
                                                col.key === 'position' ? { color: '#555', fontWeight: '600' } : {} // 포지션 스타일
                                            }
                                        >
                                            {/* 포맷팅 함수가 있으면 적용, 없으면 그냥 출력 */}
                                            {col.format && typeof value === 'number' ? col.format(value) : value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: '30px', color: '#888' }}>
                                검색 결과가 없습니다. ⚾️
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
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
    setRankingData([]); 

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
      <h1>KBO 통계 대시보드</h1>

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