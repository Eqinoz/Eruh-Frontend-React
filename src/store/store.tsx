import { configureStore, createSlice, isRejectedWithValue, type Middleware, type PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../services/authService";
import { productService } from "../services/productService";
import { customerService } from "../services/customerService";
import { rawMaterialService } from "../services/rawMaterialService";
import { neighborhoodService } from "../services/neighborhoodService";
import { processedProductService } from "../services/processedProductService";
import { productToProcessedService } from "../services/productToProcessedService";
import { toPackagedService } from "../services/toPackagedService";
import { orderService } from "../services/orderService";
import { contractorService } from "../services/contractorService";
import { contractorProductService } from "../services/contractorProductService";
import { stockMovementService } from "../services/stockMovementService";
import { getUserNameFromToken, getUserRoleFromToken } from "../utilities/tokenHelper";
import { userService } from "../services/userService";
import { packagingTypeService } from "../services/packagingTypeService";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

interface AuthState {
  token: string | null;
  userRole: string | string[] | null;
  userName: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Başlangıçta localStorage'daki token'a bakarak verileri dolduruyoruz
    token: localStorage.getItem("token"),
    userRole: getUserRoleFromToken(), // 👈 Helper kullanıldı
    userName: getUserNameFromToken(), // 👈 Helper kullanıldı
  } as AuthState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;
      localStorage.setItem("token", token); // Önce kaydet
      

      // 👇 HELPER'LARI KULLANARAK STATE'İ GÜNCELLE
      // Token'ı parametre olarak veriyoruz ki en güncel halini çözsün
      state.userRole = getUserRoleFromToken(token);
      state.userName = getUserNameFromToken(token);
    },
    clearToken: (state) => {
      state.token = null;
      state.userRole = null;
      state.userName = null;
      localStorage.removeItem("token");
    },
    loadToken: (state) => {
       const token = localStorage.getItem("token");

       if(token) {
           try{
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if(decoded.exp && decoded.exp < currentTime){
              console.warn("Token Süresi Dolmuş, Temizleniyor")
              localStorage.removeItem("token");
              state.token = null;
              state.userRole = null;
              state.userName = null;
              return; // Explicit void return for Redux Toolkit type safety
              
            }
            state.token = token;
            state.userRole = getUserRoleFromToken(token);
            state.userName = getUserNameFromToken(token);
           }catch(error){
            localStorage.removeItem("token");
            state.token = null;
           }
       }
    }
  },
});

export const { setToken, clearToken, loadToken } = authSlice.actions;

const rtkQueryErrorLogger: Middleware = (api) => (next) => (action) => {
  if(isRejectedWithValue(action)){
    const payload = action.payload as { status?: number };
    if(payload?.status === 401){

      toast.error("Oturum Süresi Dolmuştur, Lütfen Tekrar Giriş Yapınız.")
      api.dispatch(clearToken());
      
    }
  }
  return next(action);
}

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
    [contractorService.reducerPath]: contractorService.reducer,
    [contractorProductService.reducerPath]: contractorProductService.reducer,
    [stockMovementService.reducerPath]: stockMovementService.reducer,
    [userService.reducerPath]: userService.reducer,
    [packagingTypeService.reducerPath]: packagingTypeService.reducer,
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
      orderService.middleware,
      contractorService.middleware,
      contractorProductService.middleware,
      stockMovementService.middleware,
      userService.middleware,
      packagingTypeService.middleware,
      rtkQueryErrorLogger,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
