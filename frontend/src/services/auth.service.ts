import { apiRequest } from './api';

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

export const authService = {
  async login(data: LoginInput) {
    return apiRequest<{ accessToken: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async register(data: RegisterInput) {
    return apiRequest<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
