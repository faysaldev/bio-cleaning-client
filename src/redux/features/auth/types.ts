export interface User {
  id: string;
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
}

export interface LoginData extends User {
  token: string;
}

export type LoginResponse = TApiResponse<LoginData>;

export interface ForgotPasswordResponse {
  message: string;
}

export type ChangePasswordResponse = {
  message: string;
};
