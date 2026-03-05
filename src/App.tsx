import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  timestamp: Date;
}

interface FocusSession {
  id: string;
  duration: number; // 分钟
  completed: boolean;
  timestamp: Date;
}

interface GrowthData {
  level: number;
  experience: number;
  nextLevelExperience: number;
  totalSessions: number;
  consecutiveDays: number;
}

function App() {
  // 状态管理
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5 * 60); // 默认5分钟
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [growthData, setGrowthData] = useState<GrowthData>({
    level: 1,
    experience: 0,
    nextLevelExperience: 100,
    totalSessions: 0,
    consecutiveDays: 1
  });
  const [recommendedDuration, setRecommendedDuration] = useState(5);

  // 检查登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // 登录处理
  const handleLogin = (username: string) => {
    localStorage.setItem('currentUser', username);
    setCurrentUser(username);
    loadUserData(username);
  };

  // 注册处理
  const handleRegister = (username: string) => {
    localStorage.setItem('currentUser', username);
    setCurrentUser(username);
    loadUserData(username);
  };

  // 登出处理
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setHabits([]);
    setFocusSessions([]);
    setGrowthData({
      level: 1,
      experience: 0,
      nextLevelExperience: 100,
      totalSessions: 0,
      consecutiveDays: 1
    });
    setRecommendedDuration(5);
  };

  // 加载用户数据
  const loadUserData = (username: string) => {
    const savedHabits = localStorage.getItem(`habits_${username}`);
    const savedSessions = localStorage.getItem(`focusSessions_${username}`);
    const savedGrowth = localStorage.getItem(`growthData_${username}`);
    
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedSessions) setFocusSessions(JSON.parse(savedSessions));
    if (savedGrowth) setGrowthData(JSON.parse(savedGrowth));
  };

  // 保存数据到本地存储
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`habits_${currentUser}`, JSON.stringify(habits));
    }
  }, [habits, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`focusSessions_${currentUser}`, JSON.stringify(focusSessions));
    }
  }, [focusSessions, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`growthData_${currentUser}`, JSON.stringify(growthData));
    }
  }, [growthData, currentUser]);

  // 计时器逻辑
  useEffect(() => {
    let interval: number;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerActive) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  // 处理习惯记录
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      completed: true,
      timestamp: new Date()
    };
    
    setHabits(prev => [habit, ...prev]);
    setNewHabit('');
    
    // 记录完成后显示建议弹窗
    setTimeout(() => {
      setShowSuggestionModal(true);
    }, 500);
  };

  // 处理专注任务开始
  const handleStartFocus = () => {
    setShowSuggestionModal(false);
    setTimerSeconds(recommendedDuration * 60);
    setIsTimerActive(true);
  };

  // 处理专注任务完成
  const handleTimerComplete = () => {
    setIsTimerActive(false);
    
    const session: FocusSession = {
      id: Date.now().toString(),
      duration: recommendedDuration,
      completed: true,
      timestamp: new Date()
    };
    
    setFocusSessions(prev => [session, ...prev]);
    updateGrowthData();
    updateRecommendation();
  };

  // 更新成长数据
  const updateGrowthData = () => {
    setGrowthData(prev => {
      const newExperience = prev.experience + 10;
      let newLevel = prev.level;
      let newNextLevelExperience = prev.nextLevelExperience;
      
      if (newExperience >= newNextLevelExperience) {
        newLevel += 1;
        newNextLevelExperience = Math.floor(newNextLevelExperience * 1.5);
      }
      
      return {
        ...prev,
        level: newLevel,
        experience: newExperience,
        nextLevelExperience: newNextLevelExperience,
        totalSessions: prev.totalSessions + 1
      };
    });
  };

  // 更新推荐时长
  const updateRecommendation = () => {
    const completedSessions = focusSessions.length + 1;
    if (completedSessions >= 3 && recommendedDuration === 5) {
      setRecommendedDuration(15);
    } else if (completedSessions >= 10 && recommendedDuration === 15) {
      setRecommendedDuration(30);
    } else if (completedSessions >= 20 && recommendedDuration === 30) {
      setRecommendedDuration(45);
    }
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 主应用内容
  const MainContent = () => (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
        <h1>Seed - 习惯养成助手</h1>
        <button onClick={handleLogout}>登出</button>
      </div>
      
      {/* 日常记录部分 */}
      <div className="habit-section">
        <h2>日常记录</h2>
        <form className="habit-form" onSubmit={handleAddHabit}>
          <input
            type="text"
            placeholder="记录你的日常（如记账、游戏）"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button type="submit">记录</button>
        </form>
        
        <ul className="habit-list">
          {habits.map(habit => (
            <li key={habit.id} className="habit-item">
              <span>{habit.name}</span>
              <span>{new Date(habit.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* 专注任务部分 */}
      {isTimerActive && (
        <div className="habit-section">
          <h2>专注任务</h2>
          <div className="focus-timer">
            <p>当前任务：{recommendedDuration}分钟专注</p>
            <div className="timer-display">{formatTime(timerSeconds)}</div>
            <button onClick={() => setIsTimerActive(false)}>取消</button>
          </div>
        </div>
      )}
      
      {/* 成长系统部分 */}
      <div className="growth-system">
        <h2>习惯种子</h2>
        <div className="growth-level">等级：{growthData.level}</div>
        <div className="growth-bar">
          <div 
            className="growth-progress" 
            style={{ 
              width: `${Math.min((growthData.experience / growthData.nextLevelExperience) * 100, 100)}%` 
            }}
          ></div>
        </div>
        <div className="growth-stats">
          <span>经验值：{growthData.experience}/{growthData.nextLevelExperience}</span>
          <span>总专注次数：{growthData.totalSessions}</span>
          <span>连续天数：{growthData.consecutiveDays}</span>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p>推荐专注时长：{recommendedDuration}分钟</p>
        </div>
      </div>
      
      {/* 建议弹窗 */}
      {showSuggestionModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>🎉 完成！</h3>
            <p>现在，就做一点点专注吧！</p>
            <p>推荐你开始一个 {recommendedDuration} 分钟的专注任务，培养你的习惯体质。</p>
            <div className="modal-buttons">
              <button onClick={() => setShowSuggestionModal(false)}>稍后</button>
              <button onClick={handleStartFocus}>开始专注</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? <MainContent /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!currentUser ? <Register onRegister={handleRegister} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;