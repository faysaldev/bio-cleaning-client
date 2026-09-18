import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/src/redux/store/store";
import { AuthSessionData, User } from "./types";

const getStoredToken = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

type AuthState = {
  user: User | null;
  csrfToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  user: null,
  csrfToken: null,
  accessToken: getStoredToken("bio_access_token"),
  refreshToken: getStoredToken("bio_refresh_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSessionData>) => {
      state.user = action.payload.user;
      state.csrfToken = action.payload.csrfToken;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        if (typeof window !== "undefined") {
          try { localStorage.setItem("bio_access_token", action.payload.accessToken); } catch {}
        }
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        if (typeof window !== "undefined") {
          try { localStorage.setItem("bio_refresh_token", action.payload.refreshToken); } catch {}
        }
      }
    },
    clearSession: (state) => {
      state.user = null;
      state.csrfToken = null;
      state.accessToken = null;
      state.refreshToken = null;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("bio_access_token");
          localStorage.removeItem("bio_refresh_token");
        } catch {}
      }
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState): User | null => state.auth.user;
export const selectCsrfToken = (state: RootState): string | null => state.auth.csrfToken;
export const selectAccessToken = (state: RootState): string | null => state.auth.accessToken;
