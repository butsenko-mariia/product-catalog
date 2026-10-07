import React, { createContext, useState, useEffect } from 'react';
import { User, AuthResponse, AuthContextType } from '../types/auth';
import { api } from '../api/axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (username: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      username,
      password,
    });

    const { accessToken, refreshToken, ...userData } = response.data;

    localStorage.setItem('accessToken', accessToken);

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('accessToken');

      if (savedToken) {
        try {
          const response = await api.get<User>('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Session restore error:', error);
          logout();
        }
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
