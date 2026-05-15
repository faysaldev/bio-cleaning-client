import { baseApi } from "@/src/redux/baseApi/baseApi";

const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (data) => ({
        url: "/assets/upload",
        method: "POST",
        body: data,
        // Since it's multipart/form-data, we don't set Content-Type header manually,
        // fetchBaseQuery handles it when body is FormData.
      }),
      invalidatesTags: ["Asset"],
    }),
  }),
});

export const { useUploadFileMutation } = assetsApi;
