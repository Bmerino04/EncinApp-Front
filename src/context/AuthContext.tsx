import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';
import { Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';

interface AuthContextData {
  token: string | null;
  isLoading: boolean;
  signIn: (rut: string, pin: string) => Promise<void>;
  signOut: () => void;
}

interface UserToken {
  id: number;
  rut: string;
  exp: number;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        try {
          const decoded: UserToken = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            setToken(storedToken);
          } else {
            await AsyncStorage.removeItem('userToken');
          }
        } catch (e) {
          await AsyncStorage.removeItem('userToken');
        }
      }
      setIsLoading(false);
    }
    loadToken();
  }, []);

  const signIn = async (rut: string, pin: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { rut, pin });
      const { token: newToken } = response.data;
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      await AsyncStorage.setItem('userToken', newToken);
      setToken(newToken);
    } catch (error: any) {
      console.error('Sign in failed', error.response?.data);
      Alert.alert(
        'Error de autenticación',
        error.response?.data?.message || 'No se pudo iniciar sesión. Por favor, verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setToken(null);
    await AsyncStorage.removeItem('userToken');
    delete api.defaults.headers.common['Authorization'];
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 