import { createApi,} from "@reduxjs/toolkit/query/react";
import type { CustomerModel } from "../models/customerModel";
import type { ListResponseModel } from "../models/listResponseModel";
import type { CustomerAccountTransaction } from "../models/customerAccountTransaction";
import type { SingleResponseModel } from "../models/singleResponseModel";
import type { AddOpeningBalanceRequest, PayOpeningBalanceRequest, OpeningBalanceDetail } from "../models/financialTransactionModel";
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

    // 🔹 Devir borç (açılış bakiyesi) ekle
    addOpeningBalance: builder.mutation<any, AddOpeningBalanceRequest>({
      query: (data) => ({
        url: `/CustomerTransactions/add-opening-balance`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    // 🔹 Devir borçtan ödeme yap
    payOpeningBalance: builder.mutation<any, PayOpeningBalanceRequest>({
      query: (data) => ({
        url: `/CustomerTransactions/pay-opening-balance`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    // 🔹 Devir borç detaylarını getir
    getOpeningBalanceDetails: builder.query<ListResponseModel<OpeningBalanceDetail>, void>({
      query: () => "/CustomerTransactions/getdetails",
      providesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomerAccountQuery,
  useAddOpeningBalanceMutation,
  usePayOpeningBalanceMutation,
  useGetOpeningBalanceDetailsQuery,
} = customerService;



