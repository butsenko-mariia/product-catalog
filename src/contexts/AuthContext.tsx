import React, { createContext, useState, useEffect } from 'react';
import { User, AuthResponse, AuthContextType } from '../types/auth';
import { api } from '../api/axios';
import { notifications } from '@mantine/notifications';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (
    username: string,
    password: string,
    expiresInMins?: number
  ) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      username,
      password,
      expiresInMins,
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
          notifications.show({
            title: 'Error',
            message: 'Session restore error:' + error,
            color: 'red',
          });
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
    notifications.show({
      title: 'Error',
      message: 'useAuth must be used within an AuthProvider',
      color: 'red',
    });
    throw new Error();
  }
  return context;
};
