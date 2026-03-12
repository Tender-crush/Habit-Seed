import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // 导入 BrowserRouter
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>      {/* 在这里包裹 Router */}
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)