import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import FocusPage from './components/FocusPage';
import { useAuth } from './hooks/useAuth';
import { useHabits } from './hooks/useHabits';
import { Habit, GrowthData } from './types';

// 主应用内容组件的props类型
interface MainContentProps {
  logout: () => void;
  habits: Habit[];
  newHabit: string;
  setNewHabit: (value: string) => void;
  showSuggestionModal: boolean;
  setShowSuggestionModal: (value: boolean) => void;
  growthData: GrowthData;
  recommendedDuration: number;
  handleAddHabit: (e: React.FormEvent) => void;
  handleStartFocusWithNavigation: () => void;
}

// 主应用内容组件
const MainContent = ({ 
  logout, 
  habits, 
  newHabit, 
  setNewHabit, 
  showSuggestionModal, 
  setShowSuggestionModal, 
  growthData, 
  recommendedDuration, 
  handleAddHabit, 
  handleStartFocusWithNavigation 
}: MainContentProps) => (
  <div className="container">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
      <h1>Seed - 习惯养成助手</h1>
      <button onClick={logout}>登出</button>
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
            <button onClick={handleStartFocusWithNavigation}>开始专注</button>
          </div>
        </div>
      </div>
    )}
  </div>
);

function App() {
  const { currentUser, isLoading, logout } = useAuth();
  const { 
    habits, 
    newHabit, 
    setNewHabit, 
    showSuggestionModal, 
    setShowSuggestionModal, 
    growthData, 
    recommendedDuration, 
    handleAddHabit, 
    handleStartFocus 
  } = useHabits(currentUser);
  const navigate = useNavigate();

  // 处理专注任务开始
  const handleStartFocusWithNavigation = () => {
    handleStartFocus();
    navigate('/focus');
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? (
            <MainContent 
              logout={logout}
              habits={habits}
              newHabit={newHabit}
              setNewHabit={setNewHabit}
              showSuggestionModal={showSuggestionModal}
              setShowSuggestionModal={setShowSuggestionModal}
              growthData={growthData}
              recommendedDuration={recommendedDuration}
              handleAddHabit={handleAddHabit}
              handleStartFocusWithNavigation={handleStartFocusWithNavigation}
            />
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={!currentUser ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!currentUser ? <Register /> : <Navigate to="/" />} 
        />
        <Route 
          path="/focus" 
          element={currentUser ? <FocusPage /> : <Navigate to="/login" />} 
        />
      </Routes>
  );
}

export default App;