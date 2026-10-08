export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
  expiresInMins: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
