import { applyMiddleware, configureStore, createSlice } from "@reduxjs/toolkit";
import { authService } from "../services/authService";
import { productService } from "../services/productService";
import { customerService } from "../services/customerService";
import { rawMaterialService } from "../services/rawMaterialService";
import { neighborhoodService } from "../services/neighborhoodService";
import { processedProductService } from "../services/processedProductService";
import { productToProcessedService } from "../services/productToProcessedService";
import { toPackagedService } from "../services/toPackagedService";
import { orderService } from "../services/orderService";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
    loadToken: (state: any) => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) state.token = savedToken;
    },
  },
});

export const { setToken, clearToken, loadToken } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [authService.reducerPath]: authService.reducer,
    [productService.reducerPath]: productService.reducer,
    [customerService.reducerPath]: customerService.reducer,
    [rawMaterialService.reducerPath]: rawMaterialService.reducer,
    [neighborhoodService.reducerPath]: neighborhoodService.reducer,
    [processedProductService.reducerPath]: processedProductService.reducer,
    [productToProcessedService.reducerPath]: productToProcessedService.reducer,
    [toPackagedService.reducerPath]: toPackagedService.reducer,
    [orderService.reducerPath]: orderService.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      authService.middleware,
      productService.middleware,
      customerService.middleware,
      rawMaterialService.middleware,
      neighborhoodService.middleware,
      processedProductService.middleware,
      productToProcessedService.middleware,
      toPackagedService.middleware,
      orderService.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
