import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/src/redux/store/store";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token?.replace(
        /['\"]+/g,
        "",
      );
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Keep fetched data cached for 5 minutes to avoid redundant API calls
  keepUnusedDataFor: 300,
  tagTypes: ["User", "Asset", "Booking", "Contact", "Service", "Dashboard"],
  endpoints: () => ({}),
});
