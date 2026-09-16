import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/src/redux/store/store";
import { AuthSessionData, User } from "./types";

type AuthState = {
  user: User | null;
  csrfToken: string | null;
};

const initialState: AuthState = {
  user: null,
  csrfToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSessionData>) => {
      state.user = action.payload.user;
      state.csrfToken = action.payload.csrfToken;
    },
    clearSession: (state) => {
      state.user = null;
      state.csrfToken = null;
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState): User | null => state.auth.user;
export const selectCsrfToken = (state: RootState): string | null => state.auth.csrfToken;
