import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadToken, type RootState } from "./store/store";
import LoginPage from "./components/LoginPage";
import Layout from "./components/Layout";
import ProductAdd from "./components/ProductAdd";
import ProductListPage from "./components/ProductList";
import CustomerAdd from "./components/CustomerAdd";
import CustomerList from "./components/CustomerList";
import OrderAddPage from "./components/OrderAdd";
import NeighborhoodList from "./components/NeighborhoodList";
import RawMaterialAdd from "./components/RawMaterialAdd";
import RawMaterialEdit from "./components/RawMaterialEdit";
import RawMaterialList from "./components/RawMaterialList";
import ProcessedProductList from "./components/ProcessedProductList";
import ProcessingList from "./components/ProcessingList";
import ToBePackagedList from "./components/ToBePackagedList";
import ProcessingEdit from "./components/ProcessingEdit";
import ProcessedProductEdit from "./components/ProcessedProductEdit";
import ToPackagedEdit from "./components/ToPackagedEdit";
import ProductEdit from "./components/ProductEdit";
import NeighborhoodEdit from "./components/NeighborhoodEdit";
import OrderDetailsList from "./components/OrderDetailsList";
import PastOrdersList from "./components/PastOrdersList";
import CompletedPayment from "./components/CompletedPayment";
import PaymentList from "./components/PaymentList";
import CustomerAccountPage from "./components/CustomerAccountPage";
import StockList from "./components/StockList";
import ContractorAdd from "./components/ContractorAdd";
import ContractorList from "./components/ContractorList";
import ContractorDetailsPage from "./components/ContractorDetailsPage";
import ContractorProductList from "./components/ContractorProductList";
import StockMovementList from "./components/StockMovementList";
import RequireAuth from "./common/RequireAuth";
import UserAddPage from "./components/UserAddPage";
import UserList from "./components/UserList";
import PackagingTypeList from "./components/PackagingTypeList";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return (
    <Routes>
      {/* Eğer token yoksa, hangi URL'e giderse gitsin LoginPage'i göster */}
      {!token ? (
        <Route path="*" element={<LoginPage />} />
      ) : (
        <Route path="/" element={<Layout />}>
          {/* React Router, 'Layout' içindeki <Outlet />'in olduğu yere 
            aşağıdaki component'lerden hangisi eşleşiyorsa onu yerleştirir.
          */}

          {/* Anasayfa (path="/") */}
          <Route index element={<Home />} />

          {/* Diğer Tüm Sayfalar */}
          <Route path="rawmaterial-list" element={<RawMaterialList />} />
          <Route path="neighborhood-list" element={<NeighborhoodList />} />


          <Route element={<RequireAuth allowedRoles={["Admin", "Çalışan","Yönetici","Kavurmacı"]} />}>
          <Route path="processedproduct" element={<ProcessedProductList />} />
          <Route path="productToProcessed" element={<ProcessingList />} />
          <Route path="to-be-packaged" element={<ToBePackagedList />} />
          </Route>

          <Route path="completed-payment" element={<CompletedPayment />} />
          <Route path="customer-detail/:id" element={<CustomerAccountPage />} />
          <Route path="stock-list" element={<StockList />} />


          <Route element={<RequireAuth allowedRoles={["Admin", "Yönetici"]} />}>
            <Route path="stock-movement-list" element={<StockMovementList />} />
            <Route path="rawmaterial-add" element={<RawMaterialAdd />} />
            <Route path="rawmaterial-edit" element={<RawMaterialEdit />} />
            <Route path="order-add" element={<OrderAddPage />} />
            <Route path="neighborhood-list" element={<NeighborhoodList />} />
            <Route path="customer-add" element={<CustomerAdd />} />
            <Route path="customer-list" element={<CustomerList />} />
            <Route path="contractor-list" element={<ContractorList />} />
            <Route path="contractor-add" element={<ContractorAdd />} />
            <Route path="contractor-detail/:id" element={<ContractorDetailsPage />} />
            <Route path="contractor-products" element={<ContractorProductList />} />
            <Route path="order-list" element={<OrderDetailsList />} />
            <Route path="past-orders" element={<PastOrdersList />} />
            <Route path="payment-list" element={<PaymentList />} />
            <Route path="product-add" element={<ProductAdd />} />
            <Route path="product-list" element={<ProductListPage />} />
            <Route path="processing-edit" element={<ProcessingEdit />} />
            <Route path="processed-product-edit" element={<ProcessedProductEdit />} />
            <Route path="to-packaged-edit" element={<ToPackagedEdit />} />
            <Route path="product-edit" element={<ProductEdit />} />
            <Route path="neighborhood-edit" element={<NeighborhoodEdit />} />
            <Route path="user-add" element={<UserAddPage />} />
            <Route path="user-list" element={<UserList />} />
            <Route path="packaging-types" element={<PackagingTypeList />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
