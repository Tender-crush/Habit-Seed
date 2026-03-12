import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { useAuth } from '../hooks/useAuth';

const FocusPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    timerSeconds, 
    recommendedDuration, 
    handleCancelFocus, 
    formatTime 
  } = useHabits(currentUser);
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
        <h1>专注任务</h1>
        <button onClick={() => navigate('/')}>返回主页</button>
      </div>
      
      <div className="habit-section">
        <h2>正在专注</h2>
        <div className="focus-timer">
          <p>当前任务：{recommendedDuration}分钟专注</p>
          <div className="timer-display">{formatTime(timerSeconds)}</div>
          <button onClick={handleCancelFocus}>取消</button>
        </div>
      </div>
    </div>
  );
};

export default FocusPage;