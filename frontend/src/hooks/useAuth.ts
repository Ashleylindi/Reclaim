import { useState } from 'react';
import { authService } from '../services/auth.service';

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  contact: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginInput) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authService.login(data);

      localStorage.setItem('token', res.accessToken);

      return res.user;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);

    try {
      return await authService.register(data);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return {
    login,
    register,
    isAuthenticated,
    loading,
    error,
  };
}
