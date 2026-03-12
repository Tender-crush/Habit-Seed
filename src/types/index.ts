export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  timestamp: Date;
}

export interface FocusSession {
  id: string;
  duration: number; // 分钟
  completed: boolean;
  timestamp: Date;
}

export interface GrowthData {
  level: number;
  experience: number;
  nextLevelExperience: number;
  totalSessions: number;
  consecutiveDays: number;
}

export interface UserData {
  username: string;
  password: string;
  createdAt: string;
}