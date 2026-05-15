import { baseApi } from "@/src/redux/baseApi/baseApi";
import { ContactMessage, ContactResponse } from "./types";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactForm: builder.mutation<
      ContactMessage,
      Partial<ContactMessage>
    >({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contact"],
    }),
    getAllContactMessages: builder.query<ContactResponse, Record<string, any>>({
      query: (params) => ({
        url: "/contact",
        method: "GET",
        params,
      }),
      providesTags: ["Contact"],
    }),
    replyToContact: builder.mutation<
      ContactMessage,
      { id: string; reply: string }
    >({
      query: ({ id, reply }) => ({
        url: `/contact/${id}/reply`,
        method: "POST",
        body: { reply },
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useSubmitContactFormMutation,
  useGetAllContactMessagesQuery,
  useReplyToContactMutation,
} = contactApi;
