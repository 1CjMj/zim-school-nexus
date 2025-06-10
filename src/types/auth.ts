
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'bursar';
  profileImage?: string;
  class?: string;
  children?: string[];
  subjects?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  avatar_url?: string;
  phone?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
