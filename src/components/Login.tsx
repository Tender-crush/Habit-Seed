import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的本地验证（实际项目中应该通过API验证）
    const savedUser = localStorage.getItem(`user_${username}`);
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.password === password) {
        onLogin(username);
        navigate('/');
      } else {
        setError('密码错误');
      }
    } else {
      setError('用户不存在');
    }
  };

  return (
    <div className="auth-container">
      <h2>登录</h2>
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
        <button type="submit">登录</button>
      </form>
      <p className="auth-link">
        还没有账号？ <Link to="/register">注册</Link>
      </p>
    </div>
  );
};

export default Login;