import { createApi, } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { OrderModel } from "../models/orderModel";
import type { OrderDtoModel, PartialPaymentRequest } from "../models/orderDtoModel";
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
    // Sipariş için kısmi veya tam ödeme yapma
    completePayment: builder.mutation<void, PartialPaymentRequest>({
      query: (data) => ({
        url: `/CustomerTransactions/pay-order`,
        method: "POST",
        body: data,
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

