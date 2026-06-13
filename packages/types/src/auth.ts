export type UserRole = "admin" | "delivery" | "customer";

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
  name: string;
}

// Request / Response shapes

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
