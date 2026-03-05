import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterProps {
  onRegister: (username: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证密码
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    // 检查用户是否已存在
    if (localStorage.getItem(`user_${username}`)) {
      setError('用户名已存在');
      return;
    }
    
    // 保存用户数据（实际项目中应该通过API）
    const userData = {
      username,
      password,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(`user_${username}`, JSON.stringify(userData));
    
    // 初始化用户的习惯数据
    localStorage.setItem(`habits_${username}`, JSON.stringify([]));
    localStorage.setItem(`focusSessions_${username}`, JSON.stringify([]));
    localStorage.setItem(`growthData_${username}`, JSON.stringify({
      level: 1,
      experience: 0,
      nextLevelExperience: 100,
      totalSessions: 0,
      consecutiveDays: 1
    }));
    
    onRegister(username);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h2>注册</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">注册</button>
      </form>
      <p className="auth-link">
        已有账号？ <Link to="/login">登录</Link>
      </p>
    </div>
  );
};

export default Register;