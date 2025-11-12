// src/components/SideBar.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/SideBar.css"; // 👈 Bu CSS'i de birazdan oluşturacağız

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  // ⭐️ Hata Düzeltme: 'any' yerine 'string | null' kullandım
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    // 🎨 Mimari Düzeltme: Dış 'd-flex' div'i kaldırıldı.
    // 🎨 Tema: 'bg-dark' yerine 'sidebar-fistik' temamızı kullandım.
    <div
      className={`sidebar-fistik text-white p-2 d-flex flex-column ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <div className="sidebar-header d-flex align-items-center justify-content-between px-2 mb-3">
        {/* 🎨 Tema: Başlığa altın rengi verdim */}
        {!collapsed && (
          <h5 className="m-0 fw-bold fistik-title">Fıstık Pazarı</h5>
        )}
        <button
          className="btn btn-sm btn-outline-light toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <i className="bi bi-chevron-double-right"></i>
          ) : (
            <i className="bi bi-chevron-double-left"></i>
          )}
        </button>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            to="/"
            className="nav-link text-white d-flex align-items-center"
          >
            <i className="bi bi-house-door-fill me-2"></i>
            {!collapsed && <span>Anasayfa</span>}
          </Link>
        </li>

        {/* --- Stok --- */}
        <li className="nav-item">
          {/* ⭐️ Erişilebilirlik: Tıklanan 'div'i 'a' etiketiyle değiştirdim */}
          <a
            href="#"
            className="nav-link text-white d-flex align-items-center justify-content-between"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu("stok");
            }}
            role="button"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-box-seam me-2"></i>
              {!collapsed && <span>Stoklar</span>}
            </div>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${
                  openMenu === "stok" ? "up" : "down"
                }`}
              ></i>
            )}
          </a>
          {!collapsed && openMenu === "stok" && (
            <ul className="submenu list-unstyled ps-4">
              {/* 🐞 Hata Düzeltme: Geçersiz 'Link > li' yapısını 'li > Link' olarak düzelttim */}
              <li>
                <Link to="/stok-list" className="nav-link text-white py-1">
                  <i className="bi bi-eye me-2"></i> Hazır Stok Görüntüle
                </Link>
              </li>

              {/* 🎨 'hr' yerine daha şık bir ayraç ekledim */}
              <li className="submenu-divider" />

              <li>
                <Link
                  to="/rawmaterial-add"
                  className="nav-link text-white py-1"
                >
                  <i className="bi bi-plus-circle me-2"></i> Ham Madde Ekle
                </Link>
              </li>
              <li>
                <Link
                  to="/rawmaterial-list"
                  className="nav-link text-white py-1"
                >
                  <i className="bi bi-eye me-2"></i> Ham Maddeleri Görüntüle
                </Link>
              </li>

              <li className="submenu-divider" />

              <li>
                <Link
                  to="/productToProcessed"
                  className="nav-link text-white py-1"
                >
                  <i className="bi bi-list-ul me-2"></i> İşlemde Olan Ürünler
                </Link>
              </li>
              <li>
                <Link
                  to="/processedproduct"
                  className="nav-link text-white py-1"
                >
                  <i className="bi bi-list-ul me-2"></i> İşlenmiş Ürünler
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* --- Mahalle --- */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-white d-flex align-items-center justify-content-between"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu("mahalle");
            }}
            role="button"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-shop me-2"></i>
              {!collapsed && <span>Mahalle</span>}
            </div>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${
                  openMenu === "mahalle" ? "up" : "down"
                }`}
              ></i>
            )}
          </a>
          {!collapsed && openMenu === "mahalle" && (
            <ul className="submenu list-unstyled ps-4">
              {/* 🐞 Hata Düzeltme: 'Link > li' yapısını 'li > Link' olarak düzelttim */}
              <li>
                <Link
                  to="/neighborhood-list"
                  className="nav-link text-white py-1"
                >
                  <i className="bi bi-list-ul me-2"></i> Mahalledeki Ürünler
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* --- Ürünler --- */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-white d-flex align-items-center justify-content-between"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu("urun");
            }}
            role="button"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-clipboard-check-fill me-2"></i>
              {!collapsed && <span>Satışa Hazır Ürünler</span>}
            </div>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${
                  openMenu === "urun" ? "up" : "down"
                }`}
              ></i>
            )}
          </a>
          {!collapsed && openMenu === "urun" && (
            <ul className="submenu list-unstyled ps-4">
              {/* 🐞 Hata Düzeltme: 'Link > li' yapısını 'li > Link' olarak düzelttim */}
              <li>
                <Link to="/product-add" className="nav-link text-white py-1">
                  <i className="bi bi-plus-circle me-2"></i> Ürün Ekle
                </Link>
              </li>
              <li>
                <Link to="/product-list" className="nav-link text-white py-1">
                  <i className="bi bi-eye me-2"></i> Ürünleri Görüntüle
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* --- Müşteriler --- */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-white d-flex align-items-center justify-content-between"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu("musteri");
            }}
            role="button"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-person-circle me-2"></i>
              {!collapsed && <span>Müşteriler</span>}
            </div>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${
                  openMenu === "musteri" ? "up" : "down"
                }`}
              ></i>
            )}
          </a>
          {!collapsed && openMenu === "musteri" && (
            // Bu yapı zaten doğruydu (li > Link), ellemeye gerek kalmadı.
            <ul className="submenu list-unstyled ps-4">
              <li>
                <Link to="/customer-add" className="nav-link text-white py-1">
                  <i className="bi bi-plus-circle me-2"></i> Müşteri Ekle
                </Link>
              </li>
              <li>
                <Link to="/customer-list" className="nav-link text-white py-1">
                  <i className="bi bi-list-ul me-2"></i> Müşteri Listesi
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* --- Siparişler --- */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-white d-flex align-items-center justify-content-between"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu("siparis");
            }}
            role="button"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-cart-check-fill me-2"></i>
              {!collapsed && <span>Siparişler</span>}
            </div>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${
                  openMenu === "siparis" ? "up" : "down"
                }`}
              ></i>
            )}
          </a>
          {!collapsed && openMenu === "siparis" && (
            // Bu yapı da zaten doğruydu.
            <ul className="submenu list-unstyled ps-4">
              <li>
                <Link to="/order-add" className="nav-link text-white py-1">
                  <i className="bi bi-plus-circle me-2"></i> Sipariş Ekle
                </Link>
              </li>
              <li>
                <a href="#" className="nav-link text-white py-1">
                  <i className="bi bi-list-ul me-2"></i> Sipariş Listesi
                </a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
