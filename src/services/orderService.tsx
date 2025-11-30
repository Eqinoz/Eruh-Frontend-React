import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { OrderModel } from "../models/orderModel";
import type { OrderDtoModel } from "../models/orderDtoModel";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://eruh.runasp.net/api";
//const BASE_URL = "https://eruh.runasp.net/api";

export const orderService = createApi({
  reducerPath: "orderService",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
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
