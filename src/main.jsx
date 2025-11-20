import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from './Home.jsx'
import PlayerDetail from './PlayerDetail.jsx' // ⚡️ 1. 상세 페이지 불러오기
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/stats",
    element: <App />,
  },
  {
    path: "/player/:id", // ⚡️ 2. 이 주소로 오면
    element: <PlayerDetail />, // 상세 페이지를 보여줘라!
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)