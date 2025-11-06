export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  newPassword?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
