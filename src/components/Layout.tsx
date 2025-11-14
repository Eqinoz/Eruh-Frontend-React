import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header"; //
import "./css/Layout.css"; // Bu CSS'i de güncelleyeceğiz
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  return (
    // 1. Ana sarmalayıcı artık DİKEY (column)
    <div className="layout-wrapper">
      {/* 2. Header artık en tepede ve %100 genişlikte */}
      <Header />

      {/* 3. Header'ın ALTINDA kalan tüm alanı kaplayan yeni div */}
      <div className="content-body-wrapper">
        <SideBar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <ToastContainer
        position="bottom-right" // Bildirimler sağ altta çıksın
        autoClose={4000} // 4 saniyede kapansın
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // "light", "dark" veya "colored"
      />
    </div>
  );
}

export default Layout;
