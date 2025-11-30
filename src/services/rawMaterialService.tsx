import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RawMaterial } from "../models/rawMaterialModel";
import type { ListResponseModel } from "../models/listResponseModel";
import type { SingleResponseModel } from "../models/singleResponseModel";

//const BASE_URL = "https://localhost:44381/api";
const BASE_URL = "https://eruh.runasp.net/api";

export const rawMaterialService = createApi({
  reducerPath: "rawMaterialService",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["RawMaterial"],
  endpoints: (builder) => ({
    getRawMaterials: builder.query<ListResponseModel<RawMaterial>, void>({
      query: () => "/rawmaterial/",
      providesTags: ["RawMaterial"],
    }),
    getByIdRawMaterial: builder.query<SingleResponseModel<RawMaterial>, number>(
      {
        query: (id) => `/rawmaterial/${id}`,
        providesTags: ["RawMaterial"],
      }
    ),

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
    updateNewRawMaterial: builder.mutation<void, RawMaterial>({
      query: (rawMaterial) => ({
        url: `/rawmaterial/NewRMUpdate`,
        method: "PUT",
        body: rawMaterial,
      }),
      invalidatesTags: ["RawMaterial"],
    }),
    deleteRawMaterial: builder.mutation<void, number>({
      query: (id) => ({
        url: `/rawmaterial/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RawMaterial"],
    }),
  }),
});
export const {
  useGetRawMaterialsQuery,
  useLazyGetByIdRawMaterialQuery,
  useAddRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useUpdateNewRawMaterialMutation,
  useDeleteRawMaterialMutation,
} = rawMaterialService;
