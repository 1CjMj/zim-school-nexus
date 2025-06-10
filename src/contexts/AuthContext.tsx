
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts for each role
const demoUsers: User[] = [
  {
    id: '1',
    email: 'admin@educ8.zw',
    name: 'Tendai Mukamuri',
    role: 'admin'
  },
  {
    id: '2',
    email: 'teacher@educ8.zw',
    name: 'Mrs. Chipo Mutendi',
    role: 'teacher',
    subjects: ['Mathematics', 'Physics']
  },
  {
    id: '3',
    email: 'student@educ8.zw',
    name: 'Tatenda Moyo',
    role: 'student',
    class: 'Form 4A'
  },
  {
    id: '4',
    email: 'parent@educ8.zw',
    name: 'Mr. James Moyo',
    role: 'parent',
    children: ['3', '5']
  },
  {
    id: '5',
    email: 'bursar@educ8.zw',
    name: 'Mrs. Grace Sibanda',
    role: 'bursar'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('educ8_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('educ8_dark_mode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple demo authentication - in real app, this would call an API
    const foundUser = demoUsers.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('educ8_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('educ8_user');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('educ8_dark_mode', JSON.stringify(newDarkMode));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isDarkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
