import { createApi, } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { OrderModel } from "../models/orderModel";
import type { OrderDtoModel } from "../models/orderDtoModel";
import { baseQuery } from "./baseQuery";

export const orderService = createApi({
  reducerPath: "orderService",
  baseQuery: baseQuery,
  tagTypes: ["Order"],

  endpoints: (builder) => ({
    getOrder: builder.query<ListResponseModel<OrderModel>, void>({
      query: () => "/Orders",
      providesTags: ["Order"],
    }),

    getDetailsOrder: builder.query<ListResponseModel<OrderDtoModel>, void>({
      query: () => "/Orders/details",
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
    completeOrder: builder.mutation<void, { id: number; shippedDate: string }>({
      query: ({ id, shippedDate }) => ({
        url: `/Orders/Complete?id=${id}`,
        method: "POST",
        body: { id, shippedDate },
      }),
      invalidatesTags: ["Order"],
    }),
    completePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/Orders/PaymentCompletion?id=${id}`,
        method: "POST",
        body: id,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});
export const {
  useGetOrderQuery,
  useAddOrderMutation,
  useGetDetailsOrderQuery,
  useCompleteOrderMutation,
  useCompletePaymentMutation,
} = orderService;
