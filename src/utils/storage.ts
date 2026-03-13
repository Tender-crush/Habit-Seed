import { Habit, FocusSession, GrowthData, UserData } from '../types';

// 存储键前缀
const STORAGE_PREFIX = 'seed_';

// 用户相关
export const saveUser = (username: string | null, userData: UserData): void => {
  if (!username) return;
  localStorage.setItem(`${STORAGE_PREFIX}user_${username}`, JSON.stringify(userData));
};

export const getUser = (username: string | null): UserData | null => {
  if (!username) return null;
  const data = localStorage.getItem(`${STORAGE_PREFIX}user_${username}`);
  return data ? JSON.parse(data) : null;
};

export const saveCurrentUser = (username: string | null): void => {
  if (!username) return;
  localStorage.setItem(`${STORAGE_PREFIX}currentUser`, username);
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(`${STORAGE_PREFIX}currentUser`);
};

export const removeCurrentUser = (): void => {
  localStorage.removeItem(`${STORAGE_PREFIX}currentUser`);
};

// 习惯相关
export const saveHabits = (username: string | null, habits: Habit[]): void => {
  if (!username) return;
  localStorage.setItem(`${STORAGE_PREFIX}habits_${username}`, JSON.stringify(habits));
};

export const getHabits = (username: string | null): Habit[] => {
  if (!username) return [];
  const data = localStorage.getItem(`${STORAGE_PREFIX}habits_${username}`);
  if (!data) return [];
  const habits = JSON.parse(data);
  return habits.map((habit: any) => ({
    ...habit,
    timestamp: new Date(habit.timestamp)
  }));
};

// 专注任务相关
export const saveFocusSessions = (username: string | null, sessions: FocusSession[]): void => {
  if (!username) return;
  localStorage.setItem(`${STORAGE_PREFIX}focusSessions_${username}`, JSON.stringify(sessions));
};

export const getFocusSessions = (username: string | null): FocusSession[] => {
  if (!username) return [];
  const data = localStorage.getItem(`${STORAGE_PREFIX}focusSessions_${username}`);
  if (!data) return [];
  const sessions = JSON.parse(data);
  return sessions.map((session: any) => ({
    ...session,
    timestamp: new Date(session.timestamp)
  }));
};

// 成长数据相关
export const saveGrowthData = (username: string | null, growthData: GrowthData): void => {
  if (!username) return;
  localStorage.setItem(`${STORAGE_PREFIX}growthData_${username}`, JSON.stringify(growthData));
};

export const getGrowthData = (username: string | null): GrowthData => {
  if (!username) return {
    level: 1,
    experience: 0,
    nextLevelExperience: 30, // 降低经验值需求
    totalSessions: 0,
    consecutiveDays: 1
  };
  const data = localStorage.getItem(`${STORAGE_PREFIX}growthData_${username}`);
  return data ? JSON.parse(data) : {
    level: 1,
    experience: 0,
    nextLevelExperience: 30, // 降低经验值需求
    totalSessions: 0,
    consecutiveDays: 1
  };
};

// 初始化用户数据
export const initializeUserData = (username: string | null, password: string): void => {
  if (!username) return;
  const userData: UserData = {
    username,
    password,
    createdAt: new Date().toISOString()
  };
  
  saveUser(username, userData);
  saveHabits(username, []);
  saveFocusSessions(username, []);
  saveGrowthData(username, {
    level: 1,
    experience: 0,
    nextLevelExperience: 30, // 降低经验值需求
    totalSessions: 0,
    consecutiveDays: 1
  });
};