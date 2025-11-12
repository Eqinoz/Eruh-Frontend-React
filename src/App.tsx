import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadToken, type RootState } from "./store/store";
import LoginPage from "./components/LoginPage";
import Layout from "./components/Layout"; // 👈 SADECE 1 KERE İHTİYACIMIZ VAR
import ProductAdd from "./components/ProductAdd";
import ProductListPage from "./components/ProductList";
import CustomerAdd from "./components/CustomerAdd";
import CustomerList from "./components/CustomerList";
import OrderAddPage from "./components/OrderAdd";
import NeighborhoodList from "./components/NeighborhoodList";
import RawMaterialAdd from "./components/RawMaterialAdd";
import RawMaterialList from "./components/RawMaterialList";
import ProcessedProductList from "./components/ProcessedProductList";
import ProcessingList from "./components/ProcessingList";

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
        // ⭐️ İŞTE PROFESYONEL YAPI (LAYOUT ROUTE)
        // Token varsa, TÜM rotaları 'Layout' component'i ile sarmala.
        // Layout component'i Sidebar'ı ve <Outlet />'i render eder.
        <Route path="/" element={<Layout />}>
          {/* React Router, 'Layout' içindeki <Outlet />'in olduğu yere 
            aşağıdaki component'lerden hangisi eşleşiyorsa onu yerleştirir.
          */}

          {/* Anasayfa (path="/") */}
          <Route index element={<Home />} />

          {/* Diğer Tüm Sayfalar */}
          <Route path="product-add" element={<ProductAdd />} />
          <Route path="product-list" element={<ProductListPage />} />
          <Route path="customer-add" element={<CustomerAdd />} />
          <Route path="customer-list" element={<CustomerList />} />
          <Route path="order-add" element={<OrderAddPage />} />
          <Route path="rawmaterial-add" element={<RawMaterialAdd />} />
          <Route path="rawmaterial-list" element={<RawMaterialList />} />
          <Route path="neighborhood-list" element={<NeighborhoodList />} />
          <Route path="processedproduct" element={<ProcessedProductList />} />
          <Route path="productToProcessed" element={<ProcessingList />} />

          {/* Eşleşen başka bir yol yoksa anasayfaya yönlendir */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
