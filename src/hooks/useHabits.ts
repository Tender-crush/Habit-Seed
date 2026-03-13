import { useState, useEffect, useCallback } from 'react';
import { Habit, FocusSession, GrowthData } from '../types';
import { saveHabits, getHabits, saveFocusSessions, getFocusSessions, saveGrowthData, getGrowthData } from '../utils/storage';

export const useHabits = (username: string | null) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5 * 60);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [growthData, setGrowthData] = useState<GrowthData>({
    level: 1,
    experience: 0,
    nextLevelExperience: 30, // 降低经验值需求
    totalSessions: 0,
    consecutiveDays: 1
  });
  const [recommendedDuration, setRecommendedDuration] = useState(5);

  // 加载用户数据
  useEffect(() => {
    if (username) {
      const loadedHabits = getHabits(username);
      const loadedSessions = getFocusSessions(username);
      const loadedGrowth = getGrowthData(username);

      setHabits(loadedHabits);
      setFocusSessions(loadedSessions);
      setGrowthData(loadedGrowth);

      // 根据已完成的专注任务数量更新推荐时长
      const completedSessions = loadedSessions.length;
      if (completedSessions >= 15) {
        setRecommendedDuration(45);
      } else if (completedSessions >= 8) {
        setRecommendedDuration(30);
      } else if (completedSessions >= 3) {
        setRecommendedDuration(15);
      } else {
        setRecommendedDuration(5);
      }
    } else {
      // 当用户未登录时，重置状态
      setHabits([]);
      setNewHabit('');
      setShowSuggestionModal(false);
      setIsTimerActive(false);
      setTimerSeconds(5 * 60);
      setFocusSessions([]);
      setGrowthData({
        level: 1,
        experience: 0,
        nextLevelExperience: 30,
        totalSessions: 0,
        consecutiveDays: 1
      });
      setRecommendedDuration(5);
    }
  }, [username]);

  // 保存习惯数据
  useEffect(() => {
    if (username) {
      saveHabits(username, habits);
    }
  }, [habits, username]);

  // 保存专注任务数据
  useEffect(() => {
    if (username) {
      saveFocusSessions(username, focusSessions);
    }
  }, [focusSessions, username]);

  // 保存成长数据
  useEffect(() => {
    if (username) {
      saveGrowthData(username, growthData);
    }
  }, [growthData, username]);

  // 处理习惯记录
  const handleAddHabit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      completed: false,
      timestamp: new Date()
    };

    setHabits(prev => [habit, ...prev]);
    setNewHabit('');

    // 记录完成后显示建议弹窗
    setTimeout(() => {
      setShowSuggestionModal(true);
    }, 500);
  }, [newHabit]);

  // 处理专注任务开始
  const handleStartFocus = useCallback(() => {
    setShowSuggestionModal(false);
    setTimerSeconds(recommendedDuration * 60);
    setIsTimerActive(true);
  }, [recommendedDuration]);

  // 处理专注任务取消
  const handleCancelFocus = useCallback(() => {
    setIsTimerActive(false);
  }, []);

  // 更新成长数据
  const updateGrowthData = useCallback(() => {
    setGrowthData(prev => {
      const newExperience = prev.experience + 10;
      let newLevel = prev.level;
      let newNextLevelExperience = prev.nextLevelExperience;

      if (newExperience >= newNextLevelExperience) {
        newLevel += 1;
        newNextLevelExperience = Math.floor(newNextLevelExperience * 1.3); // 降低经验值增长系数
      }

      return {
        ...prev,
        level: newLevel,
        experience: newExperience,
        nextLevelExperience: newNextLevelExperience,
        totalSessions: prev.totalSessions + 1
      };
    });
  }, []);

  // 更新推荐时长
  const updateRecommendation = useCallback(() => {
    const completedSessions = focusSessions.length + 1;
    if (completedSessions >= 3 && recommendedDuration === 5) {
      setRecommendedDuration(15);
    } else if (completedSessions >= 8 && recommendedDuration === 15) { // 降低升级条件
      setRecommendedDuration(30);
    } else if (completedSessions >= 15 && recommendedDuration === 30) { // 降低升级条件
      setRecommendedDuration(45);
    }
  }, [focusSessions.length, recommendedDuration]);

  // 处理专注任务完成
  const handleTimerComplete = useCallback(() => {
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
  }, [recommendedDuration, updateGrowthData, updateRecommendation]);

  // 计时器逻辑
  useEffect(() => {
    let interval: number | undefined;
    if (isTimerActive && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerActive) {
      handleTimerComplete();
    }
    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isTimerActive, timerSeconds, handleTimerComplete]);

  // 格式化时间
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    habits,
    newHabit,
    setNewHabit,
    showSuggestionModal,
    setShowSuggestionModal,
    isTimerActive,
    timerSeconds,
    growthData,
    recommendedDuration,
    handleAddHabit,
    handleStartFocus,
    handleCancelFocus,
    formatTime
  };
};