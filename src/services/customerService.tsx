import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CustomerModel } from "../models/customerModel";
import type { ListResponseModel } from "../models/listResponseModel";

const BASE_URL = "https://localhost:44381/api";

export const customerService = createApi({
  reducerPath: "customerService",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Customer"],

  endpoints: (builder) => ({
    // 🔹 Tüm müşterileri getir
    getCustomers: builder.query<ListResponseModel<CustomerModel>, void>({
      query: () => "/customers",
      providesTags: ["Customer"],
    }),

    // 🔹 Müşteri ekle
    addCustomer: builder.mutation<any, CustomerModel>({
      query: (customer) => ({
        url: "/customers",
        method: "POST",
        body: customer,
      }),
      invalidatesTags: ["Customer"],
    }),

    updateCustomer: builder.mutation<any, CustomerModel>({
      query: (customer) => ({
        url: `/customers`,
        method: "PUT",
        body: customer,
      }),
      invalidatesTags: ["Customer"],
    }),

    // 🔹 Müşteri sil
    deleteCustomer: builder.mutation<any, number>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} = customerService;
