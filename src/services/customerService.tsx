import { createApi,} from "@reduxjs/toolkit/query/react";
import type { CustomerModel } from "../models/customerModel";
import type { ListResponseModel } from "../models/listResponseModel";
import type { CustomerAccountTransaction } from "../models/customerAccountTransaction";
import type { SingleResponseModel } from "../models/singleResponseModel";
import { baseQuery } from "./baseQuery";

export const customerService = createApi({
  reducerPath: "customerService",
  baseQuery: baseQuery,
  tagTypes: ["Customer"],

  endpoints: (builder) => ({
    // 🔹 Tüm müşterileri getir
    getCustomers: builder.query<ListResponseModel<CustomerModel>, void>({
      query: () => "/customers",
      providesTags: ["Customer"],
    }),
    getCustomerAccount: builder.query<
      SingleResponseModel<CustomerAccountTransaction>,
      string
    >({
      query: (customerId) => `/customers/AccountTransaction/${customerId}`,
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
  useGetCustomerAccountQuery,
} = customerService;
