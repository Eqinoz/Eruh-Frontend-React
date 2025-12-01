import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";
import "./css/Layout.css";
import "./css/responsive-utilities.css"; // Yeni responsive utilities
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  // Mobil sidebar state yönetimi
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="layout-wrapper">
      {/* Header'a hamburger menu toggle fonksiyonu gönder */}
      <Header onToggleMobileSidebar={toggleMobileSidebar} />

      {/* Mobil backdrop overlay */}
      <div
        className={`mobile-backdrop ${isMobileSidebarOpen ? "show" : ""}`}
        onClick={closeMobileSidebar}
      />

      <div className="content-body-wrapper">
        {/* SideBar'a mobil state gönder */}
        <SideBar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />
        <main className="main-content">
          <div className="container-fluid px-2 px-md-4 mt-3 mt-md-4">
            <Outlet />
          </div>
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
