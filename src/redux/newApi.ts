import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getUserAuthToken } from "./header"; // adjust path if needed

export const newApi = createApi({
  reducerPath: "newApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`, // no trailing slash
    credentials: "include",
    prepareHeaders: async (headers) => {
      const token = await getUserAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["ATTACHMENTS"],
  endpoints: (builder) => ({
    getAttachments: builder.query<any[], void>({
      query: () => ({
        url: "/attachments",
        method: "GET",
      }),
      providesTags: ["ATTACHMENTS"],
    }),
  }),
});

export const { useGetAttachmentsQuery } = newApi;
