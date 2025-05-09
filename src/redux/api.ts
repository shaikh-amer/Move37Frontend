import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getUserAuthToken } from "./header";

// const BASE_URL = "https://deploybg.onrender.com/api";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: async (headers, api) => {
      const token = await getUserAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["USER"],
  endpoints: (builder) => ({
    scriptGenerator: builder.mutation({
      query: (prompt) => ({
        url: "/ai/generate-script",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: { script: prompt.input },
      }),
      invalidatesTags: ["USER"],
    }),
    videoGenerator: builder.mutation({
      query: (data) => ({
        url: "/generate-video",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),
    previewScene: builder.mutation({
      query: (data) => ({
        url: "/preview-scene",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),
    finalVideoOutput: builder.mutation({
      query: (data) => ({
        url: "/download-video",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),
    generateScenarios: builder.mutation({
      query: (data) => ({
        url: "/visualTemplates",
        method: "get",
        headers: { "Content-Type": "application/json" },
        params: {
          keyword: data.input,
        },
      }),
      invalidatesTags: ["USER"],
    }),
    generateCustomAiVoice: builder.mutation({
      query: (data) => ({
        url: "/custom-preview-scene",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),
    voiceOverTracks: builder.mutation({
      query: () => ({
        url: "/voiceOverTracks",
        method: "get",
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["USER"],
    }),
    generateBackgroundMusic: builder.mutation({
      query: (data) => ({
        url: "/musicTracks",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),

    generateSignedUrl: builder.mutation({
      query: (data) => ({
        url: "/getSignedUrl",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),
    getStoredVisuals: builder.query({
      query: () => ({
        url: "/attachments",
        method: "get",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["USER"],
    }),
    changeVoiceOver: builder.mutation({
      query: (data) => ({
        url: "/update-scene-speaker",
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useScriptGeneratorMutation,
  useVideoGeneratorMutation,
  usePreviewSceneMutation,
  useFinalVideoOutputMutation,
  useGenerateScenariosMutation,
  useGenerateCustomAiVoiceMutation,
  useVoiceOverTracksMutation,
  useGenerateBackgroundMusicMutation,
  useGenerateSignedUrlMutation,
  useGetStoredVisualsQuery,
  useChangeVoiceOverMutation,
} = api;
