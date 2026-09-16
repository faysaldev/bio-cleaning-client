export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "admin" | "user";
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
}

export type LoginResponse = TApiResponse<AuthSessionData>;
export type ForgotPasswordResponse = TApiResponse<Record<string, never>>;
export type ChangePasswordResponse = TApiResponse<Record<string, never>>;
