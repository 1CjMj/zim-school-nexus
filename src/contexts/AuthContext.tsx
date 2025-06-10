
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'principal';
  avatar_url?: string;
  phone?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock demo accounts
const demoAccounts = [
  { 
    id: '1', 
    email: 'admin@educ8.zw', 
    password: 'demo123', 
    full_name: 'Tendai Mukamuri', 
    role: 'admin' as const 
  },
  { 
    id: '2', 
    email: 'teacher@educ8.zw', 
    password: 'demo123', 
    full_name: 'Mrs. Chipo Mutendi', 
    role: 'teacher' as const 
  },
  { 
    id: '3', 
    email: 'student@educ8.zw', 
    password: 'demo123', 
    full_name: 'Tatenda Moyo', 
    role: 'student' as const 
  },
  { 
    id: '4', 
    email: 'parent@educ8.zw', 
    password: 'demo123', 
    full_name: 'Mr. James Moyo', 
    role: 'parent' as const 
  },
  { 
    id: '5', 
    email: 'bursar@educ8.zw', 
    password: 'demo123', 
    full_name: 'Mrs. Grace Sibanda', 
    role: 'admin' as const 
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('educ8_dark_mode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    // Check for saved user session
    const savedUser = localStorage.getItem('educ8_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setSession({ user: parsedUser, access_token: 'mock-token' });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('educ8_user');
      }
    }
    
    setLoading(false);
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
    try {
      const account = demoAccounts.find(acc => acc.email === email && acc.password === password);
      
      if (!account) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }

      const userProfile: UserProfile = {
        id: account.id,
        email: account.email,
        full_name: account.full_name,
        role: account.role
      };

      setUser(userProfile);
      setSession({ user: userProfile, access_token: 'mock-token' });
      localStorage.setItem('educ8_user', JSON.stringify(userProfile));

      toast({
        title: "Login Successful",
        description: "Welcome to Educ8!",
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during login",
        variant: "destructive"
      });
      return false;
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: string = 'student'): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingAccount = demoAccounts.find(acc => acc.email === email);
      if (existingAccount) {
        toast({
          title: "Signup Failed",
          description: "An account with this email already exists",
          variant: "destructive"
        });
        return false;
      }

      // For mock system, just show success message
      toast({
        title: "Signup Successful",
        description: "Account created successfully! You can now log in.",
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during signup",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      setSession(null);
      localStorage.removeItem('educ8_user');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during logout",
        variant: "destructive"
      });
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('educ8_dark_mode', JSON.stringify(newDarkMode));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login, 
      signup, 
      logout, 
      loading, 
      isDarkMode, 
      toggleDarkMode 
    }}>
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
