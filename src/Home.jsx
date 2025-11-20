import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // 스타일 공유

const Home = () => {
  return (
    <div className="home-container">
      {/* 1. 히어로 섹션 (대문) */}
      <header className="hero-section">
        <h1 className="hero-title">⚾ KBO 세이버메트릭스</h1>
        <p className="hero-subtitle">
          데이터로 야구를 다시 보다. <br />
          FIP, wRC+, OPS 등 고급 지표를 통해 선수의 진짜 가치를 발견하세요.
        </p>
      </header>

      {/* 2. 기능 선택 카드 (메뉴) */}
      <div className="menu-grid">
        
        {/* 카드 1: 통계 대시보드 */}
        <Link to="/stats" className="menu-card main-card">
          <div className="icon">📊</div>
          <h3>통계 대시보드</h3>
          <p>투수(ERA, FIP) 및 타자(OPS, wRC) 랭킹을 <br/>한눈에 확인하세요.</p>
        </Link>

        {/* 카드 2: (예시) 팀 분석 - 준비중 */}
        <div className="menu-card disabled">
          <div className="icon">🏆</div>
          <h3>팀 전력 분석</h3>
          <p>구단별 승률, 피타고리안 승률 분석 <br/>(업데이트 예정)</p>
        </div>

        {/* 카드 3: (예시) 선수 예측 - 준비중 */}
        <div className="menu-card disabled">
          <div className="icon">🔮</div>
          <h3>AI 성적 예측</h3>
          <p>머신러닝 기반 다음 시즌 성적 예측 <br/>(업데이트 예정)</p>
        </div>

      </div>
    </div>
  );
};

export default Home;