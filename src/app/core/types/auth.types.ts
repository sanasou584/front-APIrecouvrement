import type { UserRole } from '../constants/app.constants';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
  user: AuthUser;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
}