import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

const Home = () => {
  return (
    <div className="home-container">
      {/* 타이틀 영역 */}
      <header className="hero-section">
        <h1 className="hero-title">KBO SAVERMATRIX</h1>
        <p className="hero-subtitle">
          데이터로 보는 야구의 모든 것.<br />
          직관을 넘어선 분석, 숫자로 증명하는 선수의 가치.
        </p>
      </header>

      {/* 메뉴 카드 영역 */}
      <div className="menu-grid">
        
        {/* 1. 통계 랭킹 센터 (사용 가능) */}
        <Link to="/stats" className="menu-card main-card">
          <span className="badge hot">Available</span>
          <div className="icon">📊</div>
          <h3>통계 랭킹 센터</h3>
          <p>OPS, wRC+, WAR, PFR 등<br/>세이버메트릭스 핵심 지표 분석</p>
        </Link>

        {/* 2. 구단 분석 (준비중) */}
        <div className="menu-card disabled">
          <span className="badge soon">Update Soon</span>
          <div className="icon">🏟️</div>
          <h3>구단 전력 분석</h3>
          <p>팀별 피타고리안 승률 분석 및<br/>시즌 승수 시뮬레이션</p>
        </div>

        {/* 3. AI 예측 (준비중) */}
        <div className="menu-card disabled">
          <span className="badge soon">Coming Later</span>
          <div className="icon">🔮</div>
          <h3>AI 성적 예측</h3>
          <p>머신러닝 기반 2025 시즌<br/>성적 및 MVP 예측 모델</p>
        </div>

      </div>
    </div>
  );
};

export default Home;