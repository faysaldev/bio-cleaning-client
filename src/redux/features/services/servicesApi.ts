import { baseApi } from "@/src/redux/baseApi/baseApi";
import { CleaningService, ServicesResponse } from "./types";

const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query<ServicesResponse, Record<string, any>>({
      query: (params) => ({
        url: "/services",
        method: "GET",
        params,
      }),
      providesTags: ["Service"],
    }),
    getSingleService: builder.query<CleaningService, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
    createService: builder.mutation<CleaningService, Partial<CleaningService>>({
      query: (data) => ({
        url: "/services",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation<
      CleaningService,
      { id: string; data: Partial<CleaningService> }
    >({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetSingleServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
