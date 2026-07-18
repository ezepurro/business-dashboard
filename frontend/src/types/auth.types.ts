export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: true;
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  success: true;
  accessToken: string;
}

export interface MeResponse {
  success: true;
  user: User;
}
