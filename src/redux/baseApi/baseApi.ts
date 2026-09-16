import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import type { RootState } from "@/src/redux/store/store";
import { clearSession, setSession } from "@/src/redux/features/auth/authSlice";
import type { AuthSessionData, TApiResponse } from "@/src/redux/features/auth/types";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const csrfToken = (getState() as RootState).auth.csrfToken;
    if (csrfToken) headers.set("x-csrf-token", csrfToken);
    return headers;
  },
});

let refreshPromise: Promise<AuthSessionData | null> | null = null;
type RawBaseQueryExtraOptions = Parameters<typeof rawBaseQuery>[2];

const refreshSession = async (
  api: BaseQueryApi,
  extraOptions: RawBaseQueryExtraOptions,
): Promise<AuthSessionData | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions,
      );

      if (!refreshResult.data) return null;
      const payload = refreshResult.data as TApiResponse<AuthSessionData>;
      return payload.data?.user && payload.data?.csrfToken ? payload.data : null;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : args.url;
  const canRefresh =
    !requestUrl.includes("/auth/login") &&
    !requestUrl.includes("/auth/register") &&
    !requestUrl.includes("/auth/refresh") &&
    !requestUrl.includes("/auth/forgot-password") &&
    !requestUrl.includes("/auth/reset-password");

  if (result.error?.status === 401 && canRefresh) {
    const session = await refreshSession(api, extraOptions);
    if (session) {
      api.dispatch(setSession(session));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearSession());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  tagTypes: ["User", "Asset", "Booking", "Contact", "Service", "Dashboard"],
  endpoints: () => ({}),
});
