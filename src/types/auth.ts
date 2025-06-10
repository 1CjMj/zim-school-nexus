
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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
