export type UserRole = "owner" | "admin" | "manager" | "dispatcher" | "cleaner" | "support" | "read_only" | "user";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

export interface TApiResponse<T> {
  code: number;
  message: string;
  status: string;
  data: T;
  meta?: unknown;
}

export interface AuthSessionData {
  user: User;
  csrfToken: string;
  accessToken?: string;
  refreshToken?: string;
}

export type LoginResponse = TApiResponse<AuthSessionData>;
export type ForgotPasswordResponse = TApiResponse<Record<string, never>>;
export type ChangePasswordResponse = TApiResponse<Record<string, never>>;
