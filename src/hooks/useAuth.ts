import { useState, useEffect } from 'react';
import { getCurrentUser, saveCurrentUser, removeCurrentUser, initializeUserData, getUser } from '../utils/storage';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化登录状态
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // 登录
  const login = (username: string, password: string): boolean => {
    const userData = getUser(username);
    if (userData && userData.password === password) {
      saveCurrentUser(username);
      setCurrentUser(username);
      return true;
    }
    return false;
  };

  // 注册
  const register = (username: string, password: string): boolean => {
    const existingUser = getUser(username);
    if (existingUser) {
      return false;
    }
    
    initializeUserData(username, password);
    saveCurrentUser(username);
    setCurrentUser(username);
    return true;
  };

  // 登出
  const logout = () => {
    removeCurrentUser();
    setCurrentUser(null);
  };

  return {
    currentUser,
    isLoading,
    login,
    register,
    logout
  };
};