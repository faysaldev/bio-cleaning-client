import { baseApi } from "@/src/redux/baseApi/baseApi";
import {
  LoginResponse,
  ForgotPasswordResponse,
  User,
  ChangePasswordResponse,
} from "./types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, any>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, { email: string }>(
      {
        query: (data) => ({
          url: "/auth/forgot-password",
          method: "POST",
          body: data,
        }),
      },
    ),
    changePassword: builder.mutation<ChangePasswordResponse, any>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ForgotPasswordResponse, any>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: { password },
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useChangePasswordMutation,
} = authApi;
