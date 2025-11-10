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
import StokList from "./components/StokList";
import StokAdd from "./components/StokAdd";
import NeighborhoodList from "./components/NeighborhoodList";

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
            path="/stok-add"
            element={
              <Layout>
                <StokAdd />
              </Layout>
            }
          />
          <Route
            path="/stok-list"
            element={
              <Layout>
                <StokList />
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
          {/* Buraya istersen diğer sayfaları da ekleyebilirsin */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
