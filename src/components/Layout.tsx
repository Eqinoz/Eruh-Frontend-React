// src/components/Layout.tsx

import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header"; // Header'ını import et (zaten vardı)
import "./css/Layout.css"; // Bu CSS'i de güncelleyeceğiz

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
    </div>
  );
}

export default Layout;
