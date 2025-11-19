import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { OrderModel } from "../models/orderModel";

const BASE_URL = "https://localhost:44381/api";

export const orderService = createApi({
  reducerPath: "orderService",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Order"],

  endpoints: (builder) => ({
    getOrder: builder.query<ListResponseModel<OrderModel>, void>({
      query: () => "/Orders",
      providesTags: ["Order"],
    }),

    addOrder: builder.mutation<any, OrderModel>({
      query: (order) => ({
        url: "/Orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});
export const { useGetOrderQuery, useAddOrderMutation } = orderService;
