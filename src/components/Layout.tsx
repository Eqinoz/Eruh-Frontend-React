import React from "react";
import Header from "./Header";
import SideBar from "./SideBar";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="d-flex flex-column vh-100">
      {/* Üst Header */}
      <Header />

      {/* Header'ın altı: Sidebar + içerik */}
      <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
        {/* Sol Menü */}
        <SideBar />

        {/* Sağ İçerik Alanı */}
        <main
          className="flex-grow-1 bg-light p-4"
          style={{ overflowY: "auto", minHeight: "100%" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
