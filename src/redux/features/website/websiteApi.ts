import { baseApi } from "@/src/redux/baseApi/baseApi";
import type { ApiEnvelope, WebsiteAdminPayload, WebsiteMedia, WebsitePublicPayload, WebsiteRevision, WebsiteSnapshot } from "./types";

const websiteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicWebsite: builder.query<ApiEnvelope<WebsitePublicPayload>, void>({
      query: () => ({ url: "/website/public", method: "GET" }),
      providesTags: ["Website"],
    }),
    getWebsitePreview: builder.query<ApiEnvelope<WebsitePublicPayload>, string>({
      query: (token) => ({ url: `/website/preview/${encodeURIComponent(token)}`, method: "GET" }),
    }),
    getWebsiteAdmin: builder.query<ApiEnvelope<WebsiteAdminPayload>, void>({
      query: () => ({ url: "/website/admin", method: "GET" }),
      providesTags: ["Website"],
    }),
    saveWebsiteDraft: builder.mutation<ApiEnvelope<WebsiteAdminPayload>, WebsiteSnapshot>({
      query: (snapshot) => ({ url: "/website/draft", method: "PATCH", body: { snapshot } }),
      invalidatesTags: ["Website"],
    }),
    publishWebsite: builder.mutation<ApiEnvelope<WebsiteAdminPayload>, { note?: string }>({
      query: (body) => ({ url: "/website/publish", method: "POST", body }),
      invalidatesTags: ["Website"],
    }),
    resetWebsiteDraft: builder.mutation<ApiEnvelope<WebsiteAdminPayload>, void>({
      query: () => ({ url: "/website/reset-draft", method: "POST" }),
      invalidatesTags: ["Website"],
    }),
    createWebsitePreviewToken: builder.mutation<ApiEnvelope<{ token: string; revision: number; expiresInMinutes: number }>, void>({
      query: () => ({ url: "/website/preview-token", method: "POST" }),
    }),
    getWebsiteRevisions: builder.query<ApiEnvelope<WebsiteRevision[]>, void>({
      query: () => ({ url: "/website/revisions", method: "GET" }),
      providesTags: ["WebsiteRevision"],
    }),
    restoreWebsiteRevision: builder.mutation<ApiEnvelope<WebsiteAdminPayload>, number>({
      query: (revision) => ({ url: `/website/revisions/${revision}/restore`, method: "POST" }),
      invalidatesTags: ["Website", "WebsiteRevision"],
    }),
    getWebsiteMedia: builder.query<ApiEnvelope<WebsiteMedia[]>, void>({
      query: () => ({ url: "/website/media", method: "GET" }),
      providesTags: ["WebsiteMedia"],
    }),
    createWebsiteMedia: builder.mutation<ApiEnvelope<WebsiteMedia>, { url: string; altText: string; label?: string; kind?: "image" | "video" | "document" }>({
      query: (body) => ({ url: "/website/media", method: "POST", body }),
      invalidatesTags: ["WebsiteMedia"],
    }),
    deleteWebsiteMedia: builder.mutation<ApiEnvelope<WebsiteMedia>, string>({
      query: (id) => ({ url: `/website/media/${id}`, method: "DELETE" }),
      invalidatesTags: ["WebsiteMedia"],
    }),
  }),
});

export const {
  useGetPublicWebsiteQuery,
  useGetWebsitePreviewQuery,
  useGetWebsiteAdminQuery,
  useSaveWebsiteDraftMutation,
  usePublishWebsiteMutation,
  useResetWebsiteDraftMutation,
  useCreateWebsitePreviewTokenMutation,
  useGetWebsiteRevisionsQuery,
  useRestoreWebsiteRevisionMutation,
  useGetWebsiteMediaQuery,
  useCreateWebsiteMediaMutation,
  useDeleteWebsiteMediaMutation,
} = websiteApi;
