import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProductModel } from "../models/productModel";
import type { ListResponseModel } from "../models/listResponseModel";
import type { InventoryStatusModel } from "../models/inventoryStatusModel";
import type { SingleResponseModel } from "../models/singleResponseModel";

export const productService = createApi({
  reducerPath: "productService",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44381/api", // 🔹 senin backend URL'in
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
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
  }),
});

export const { useGetProductsQuery, useAddProductMutation, useGetInventoryStatusQuery } = productService;
