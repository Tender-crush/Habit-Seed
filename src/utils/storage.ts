import { Habit, FocusSession, GrowthData, UserData } from '../types';

// 存储键前缀
const STORAGE_PREFIX = 'seed_';

// 用户相关
export const saveUser = (username: string, userData: UserData): void => {
  localStorage.setItem(`${STORAGE_PREFIX}user_${username}`, JSON.stringify(userData));
};

export const getUser = (username: string): UserData | null => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}user_${username}`);
  return data ? JSON.parse(data) : null;
};

export const saveCurrentUser = (username: string): void => {
  localStorage.setItem(`${STORAGE_PREFIX}currentUser`, username);
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(`${STORAGE_PREFIX}currentUser`);
};

export const removeCurrentUser = (): void => {
  localStorage.removeItem(`${STORAGE_PREFIX}currentUser`);
};

// 习惯相关
export const saveHabits = (username: string, habits: Habit[]): void => {
  localStorage.setItem(`${STORAGE_PREFIX}habits_${username}`, JSON.stringify(habits));
};

export const getHabits = (username: string): Habit[] => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}habits_${username}`);
  return data ? JSON.parse(data) : [];
};

// 专注任务相关
export const saveFocusSessions = (username: string, sessions: FocusSession[]): void => {
  localStorage.setItem(`${STORAGE_PREFIX}focusSessions_${username}`, JSON.stringify(sessions));
};

export const getFocusSessions = (username: string): FocusSession[] => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}focusSessions_${username}`);
  return data ? JSON.parse(data) : [];
};

// 成长数据相关
export const saveGrowthData = (username: string, growthData: GrowthData): void => {
  localStorage.setItem(`${STORAGE_PREFIX}growthData_${username}`, JSON.stringify(growthData));
};

export const getGrowthData = (username: string): GrowthData => {
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
export const initializeUserData = (username: string, password: string): void => {
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