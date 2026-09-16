"use client";

import { store } from "@/src/redux/store/store";
import { useEffect } from "react";
import { Provider } from "react-redux";

const LEGACY_AUTH_STORAGE_KEY = "persist:auth-bio-cleaning";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Remove the old redux-persist payload because it may contain the legacy
    // bearer token. Authentication is now held in HttpOnly cookies instead.
    window.localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
