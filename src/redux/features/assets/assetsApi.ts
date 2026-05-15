import { baseApi } from "@/src/redux/baseApi/baseApi";
import { UploadResponse } from "./types";

const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<UploadResponse, FormData>({
      query: (data) => ({
        url: "/assets/upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Asset"],
    }),
  }),
});

export const { useUploadFileMutation } = assetsApi;
