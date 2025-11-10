import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RawMaterial } from "../models/rawMaterialModel";

import type { ListResponseModel } from "../models/listResponseModel";

export const rawMaterialService = createApi({
  reducerPath: "rawMaterialService",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44381/api", // 🔹 senin backend URL'in
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["RawMaterial"],
  endpoints: (builder) => ({
    getRawMaterials: builder.query<ListResponseModel<RawMaterial>, void>({
      query: () => "/rawmaterial/getall",
      providesTags: ["RawMaterial"],
    }),

    addRawMaterial: builder.mutation<void, RawMaterial>({
      query: (rawMaterial) => ({
        url: "/rawmaterial",
        method: "POST",
        body: rawMaterial,
      }),
      invalidatesTags: ["RawMaterial"],
    }),
    updateRawMaterial: builder.mutation<void, RawMaterial>({
      // API expects the full object in the body (no id in the URL)
      query: (rawMaterial) => ({
        url: `/rawmaterial`,
        method: "PUT",
        body: rawMaterial,
      }),
      invalidatesTags: ["RawMaterial"],
    }),
  }),
});
export const {
  useGetRawMaterialsQuery,
  useAddRawMaterialMutation,
  useUpdateRawMaterialMutation,
} = rawMaterialService;
