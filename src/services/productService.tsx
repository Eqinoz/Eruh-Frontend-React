import { createApi } from "@reduxjs/toolkit/query/react";
import type { ProductModel } from "../models/productModel";
import type { ListResponseModel } from "../models/listResponseModel";
import type { InventoryStatusModel } from "../models/inventoryStatusModel";
import type { SingleResponseModel } from "../models/singleResponseModel";
import { baseQuery } from "./baseQuery";

export const productService = createApi({
  reducerPath: "productService",
  baseQuery: baseQuery,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<ListResponseModel<ProductModel>, void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation<void, ProductModel>({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    getInventoryStatus: builder.query<SingleResponseModel<InventoryStatusModel>, void>({
      query: () => "/products/InventoryStatus",
      providesTags: ["Product"],
    }),
    updateProduct: builder.mutation<void, ProductModel>({
      query: (product) => ({
        url: `/products`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation, useGetInventoryStatusQuery, useUpdateProductMutation } = productService;
