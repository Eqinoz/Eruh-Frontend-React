import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProcessedProduct } from "../models/processedProductModel";
import type { ListResponseModel } from "../models/listResponseModel";

const BASE_URL = import.meta.env.VITE_BASE_URL;
//const BASE_URL = "https://eruh.runasp.net/api";

export const processedProductService = createApi({
  reducerPath: "processedProductService",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["ProcessedProduct"],
  endpoints: (builder) => ({
    getProcessedProducts: builder.query<
      ListResponseModel<ProcessedProduct>,
      void
    >({
      query: () => "/processedproduct/",
      providesTags: ["ProcessedProduct"],
    }),
    addProcessedProduct: builder.mutation<void, ProcessedProduct>({
      query: (product) => ({
        url: "/processedproduct",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["ProcessedProduct"],
    }),
    updateProcessedProduct: builder.mutation<void, ProcessedProduct>({
      query: (product) => ({
        url: "/processedproduct",
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["ProcessedProduct"],
    }),
    deleteProcessedProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/processedproduct/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProcessedProduct"],
    }),
  }),
});

export const {
  useGetProcessedProductsQuery,
  useAddProcessedProductMutation,
  useUpdateProcessedProductMutation,
  useDeleteProcessedProductMutation,
} = processedProductService;
