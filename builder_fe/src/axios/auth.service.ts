import { LoginUser, RegisterUser } from '@/interfaces/auth.interface';
import axios from 'axios';

import { SERVICE_ROUTES } from './config';

export const AUTH_SERVICE_ROUTE = {
  login: 'login',
  register: 'register',
} as const;

export const authAxios = axios.create({
  baseURL: SERVICE_ROUTES.AUTH,
  timeout: 14000,
  headers: { 'Content-Type': 'application/json' },
});

export const login = (user: LoginUser) => {
  return authAxios.post(AUTH_SERVICE_ROUTE.login, user, { withCredentials: true });
};

export const register = (user: RegisterUser) => {
  return authAxios.post(AUTH_SERVICE_ROUTE.register, user);
};
