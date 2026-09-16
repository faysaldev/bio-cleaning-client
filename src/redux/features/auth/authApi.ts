import { baseApi } from "@/src/redux/baseApi/baseApi";
import {
  AuthSessionData,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  LoginResponse,
  TApiResponse,
  User,
} from "./types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string; rememberMe?: boolean }>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    logoutSession: builder.mutation<TApiResponse<Record<string, never>>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["User"],
    }),
    getSession: builder.query<AuthSessionData, void>({
      query: () => ({ url: "/auth/session", method: "GET" }),
      transformResponse: (response: TApiResponse<AuthSessionData>) => response.data,
      providesTags: ["User"],
      keepUnusedDataFor: 0,
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation<ChangePasswordResponse, { oldPassword: string; newPassword: string }>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ForgotPasswordResponse, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password?token=${encodeURIComponent(token)}`,
        method: "POST",
        body: { password },
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      transformResponse: (response: TApiResponse<User>) => response.data,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutSessionMutation,
  useGetSessionQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useChangePasswordMutation,
} = authApi;
