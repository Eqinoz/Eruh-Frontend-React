import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { ProductToProcessed } from "../models/productToProcessed";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://eruh.runasp.net/api";
//const BASE_URL = "https://eruh.runasp.net/api";

export const productToProcessedService = createApi({
  reducerPath: "productToProcessedService",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["ProductToProcessed"],
  endpoints: (builder) => ({
    getProductToProcesseds: builder.query<
      ListResponseModel<ProductToProcessed>,
      void
    >({
      query: () => "/producttoprocessed/",
      providesTags: ["ProductToProcessed"],
    }),
    addProductToProcessed: builder.mutation<void, ProductToProcessed>({
      query: (product) => ({
        url: "/producttoprocessed",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["ProductToProcessed"],
    }),
    updateProductToProcessed: builder.mutation<void, ProductToProcessed>({
      query: (product) => ({
        url: "/producttoprocessed",
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["ProductToProcessed"],
    }),
    deleteProductToProcessed: builder.mutation<void, number>({
      query: (id) => ({
        url: `/producttoprocessed/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductToProcessed"],
    }),
  }),
});

export const {
  useGetProductToProcessedsQuery,
  useAddProductToProcessedMutation,
  useUpdateProductToProcessedMutation,
  useDeleteProductToProcessedMutation,
} = productToProcessedService;
