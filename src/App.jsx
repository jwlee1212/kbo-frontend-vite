import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './App.css';

// 🛠️ 컬럼 설정
const COLUMNS = {
    PITCHER: [
        { label: '선수명', key: 'name' },
        { label: '포지션', key: 'position' },
        { label: 'ERA', key: 'era', main: true, format: v => v.toFixed(2) },
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
        { label: '포지션', key: 'position' },
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

// 📊 랭킹 테이블 컴포넌트
const RankingTable = ({ data, statsType }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const processedData = useMemo(() => {
        let sortedData = [...data];

        if (searchTerm) {
            sortedData = sortedData.filter(player => 
                player.name && player.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortConfig.key) {
            sortedData.sort((a, b) => {
                const valA = a[sortConfig.key] ?? 0;
                const valB = b[sortConfig.key] ?? 0;
                
                if (typeof valA === 'string' && typeof valB === 'string') {
                    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                    return 0;
                }

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
                        processedData.map((player, idx) => (
                            <tr key={player.id || idx}>
                                {columns.map((col) => {
                                    const rawValue = player[col.key];
                                    const value = rawValue ?? (['name', 'position'].includes(col.key) ? '-' : 0);
                                    
                                    return (
                                        <td 
                                            key={col.key}
                                            style={
                                                col.main ? { fontWeight: '800', color: '#2563eb', fontSize: '1.1em', backgroundColor: 'rgba(37, 99, 235, 0.03)' } :
                                                col.key === 'name' ? { fontWeight: '600', textAlign: 'left' } : // ⚡️ 기본 텍스트 색상(검은색) 사용
                                                col.key === 'position' ? { color: '#64748b', fontSize: '0.9em' } : {}
                                            }
                                        >
                                            {col.key === 'name' ? (
                                                // ⚡️ [수정됨] color: 'black' (검은색 링크)
                                                <Link to={`/player/${player.id}`} style={{ textDecoration: 'underline', color: 'black', cursor: 'pointer' }}>
                                                    {value}
                                                </Link>
                                            ) : (
                                                col.format && typeof value === 'number' ? col.format(value) : value
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: '30px', color: '#888' }}>
                                데이터가 없습니다. (백엔드 연결 확인 필요) ⚾️
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
  
  const [page, setPage] = useState(1);
  
  useEffect(() => {
      setPage(1);
      setRankingData([]); 
  }, [currentView]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const endpoint = currentView === 'PITCHER' 
        ? `/api/pitching-ranking?page=${page}&size=20`
        : `/api/hitting-ranking?page=${page}&size=20`; 
        
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
  }, [currentView, page]);

  return (
    <div className="App">
      <h1>KBO 통계 랭킹 센터</h1>

      <div className="view-selector">
          <button 
              className={currentView === 'PITCHER' ? 'active' : ''}
              onClick={() => setCurrentView('PITCHER')}>
              투수 (Pitcher)
          </button>
          <button 
              className={currentView === 'HITTER' ? 'active' : ''}
              onClick={() => setCurrentView('HITTER')}>
              타자 (Hitter)
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
          <>
            <RankingTable 
                data={rankingData} 
                statsType={currentView} 
            />
            
            <div className="pagination">
                <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    ◀ Prev
                </button>
                <span style={{ fontWeight: '600', color: '#334155' }}>
                    Page {page}
                </span>
                <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={rankingData.length < 20}
                >
                    Next ▶
                </button>
            </div>
          </>
      )}
    </div>
  );
}

export default App;