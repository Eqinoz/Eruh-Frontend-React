import { createApi } from "@reduxjs/toolkit/query/react";
import type { ProcessedProduct } from "../models/processedProductModel";
import type { ListResponseModel } from "../models/listResponseModel";
import { baseQuery } from "./baseQuery";

export const processedProductService = createApi({
  reducerPath: "processedProductService",
  baseQuery: baseQuery,
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
