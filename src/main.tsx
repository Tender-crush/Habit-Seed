import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'  // 导入 HashRouter
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>      {/* 在这里包裹 Router */}
            <App />
        </HashRouter>
    </React.StrictMode>,
)