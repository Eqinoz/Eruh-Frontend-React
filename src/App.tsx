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
import RawMaterialList from "./components/RawMaterialList";
import ProcessedProductList from "./components/ProcessedProductList";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return (
    <Routes>
      {/* Eğer token yoksa sadece LoginPage açılsın */}
      {!token ? (
        <Route path="*" element={<LoginPage />} />
      ) : (
        <>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/product-add"
            element={
              <Layout>
                <ProductAdd />
              </Layout>
            }
          />
          <Route
            path="/product-list"
            element={
              <Layout>
                <ProductListPage />
              </Layout>
            }
          />
          <Route
            path="/customer-add"
            element={
              <Layout>
                <CustomerAdd />
              </Layout>
            }
          />
          <Route
            path="/customer-list"
            element={
              <Layout>
                <CustomerList />
              </Layout>
            }
          />
          <Route
            path="/order-add"
            element={
              <Layout>
                <OrderAddPage />
              </Layout>
            }
          />
          <Route
            path="/rawmaterial-add"
            element={
              <Layout>
                <RawMaterialAdd />
              </Layout>
            }
          />
          <Route
            path="/rawmaterial-list"
            element={
              <Layout>
                <RawMaterialList />
              </Layout>
            }
          />
          <Route
            path="/neighborhood-list"
            element={
              <Layout>
                <NeighborhoodList />
              </Layout>
            }
          />
          <Route
            path="/processedproduct"
            element={
              <Layout>
                <ProcessedProductList />
              </Layout>
            }
          />
          {/* Buraya istersen diğer sayfaları da ekleyebilirsin */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
