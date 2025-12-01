// src/components/SideBar.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/SideBar.css";

interface SideBarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

function SideBar({ isMobileOpen, onCloseMobile }: SideBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Mobilde link tıklandığında sidebar'ı kapat
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onCloseMobile();
    }
  };

  return (
    <div
      className={`sidebar-fistik text-white p-2 d-flex flex-column ${
        collapsed ? "collapsed" : ""
      } ${isMobileOpen ? "show-mobile" : ""}`}
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
            onClick={handleLinkClick}
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
                <Link to="/stock-list" className="nav-link text-white py-1" onClick={handleLinkClick}>
                  <i className="bi bi-eye me-2"></i> Hazır Stok Görüntüle
                </Link>
              </li>

              {/* 🎨 'hr' yerine daha şık bir ayraç ekledim */}
              <li className="submenu-divider" />

              <li>
                <Link
                  to="/rawmaterial-add"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-plus-circle me-2"></i> Ham Madde Ekle
                </Link>
              </li>
              <li>
                <Link
                  to="/rawmaterial-list"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-eye me-2"></i> Ham Maddeleri Görüntüle
                </Link>
              </li>

              <li className="submenu-divider" />

              <li>
                <Link
                  to="/productToProcessed"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-list-ul me-2"></i> İşlemde Olan Ürünler
                </Link>
              </li>
              <li>
                <Link
                  to="/processedproduct"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-list-ul me-2"></i> İşlenmiş Ürünler
                </Link>
              </li>
              <hr className="submenu-divider" />
              <li>
                <Link to="/to-be-packaged" className="nav-link text-white py-1" onClick={handleLinkClick}>
                  <i className="bi bi-box2-fill me-2"></i> Paketlenme
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
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-list-ul me-2"></i> Mahalledeki Ürünler
                </Link>
              </li>
            </ul>
          )}
        </li> 

        {/* --- Fasoncu Ve Komisyoncu --- */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-white d-flex align-items-center justify-content-between"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu("contractor");
            }}
            role="button"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-briefcase-fill me-2"></i>
              {!collapsed && <span>Fasoncu Ve Komisyoncu</span>}
            </div>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${
                  openMenu === "contractor" ? "up" : "down"
                }`}
              ></i>
            )}
          </a>
          {!collapsed && openMenu === "contractor" && (
            <ul className="submenu list-unstyled ps-4">
              <li>
                <Link
                  to="/contractor-add"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-plus-circle me-2"></i> Fasoncu Ve Komisyoncu Ekle
                </Link>
              </li>
              <li>
                <Link
                  to="/contractor-list"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-list-ul me-2"></i> Fasoncu Ve Komisyoncu Listesi
                </Link>
              </li>
              <hr className="submenu-divider" />
              <li>
                <Link
                  to="/contractor-products"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-list-ul me-2"></i> Fasoncu Ve Komisyoncudaki Ürünler
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
                <Link to="/product-add" className="nav-link text-white py-1" onClick={handleLinkClick}>
                  <i className="bi bi-plus-circle me-2"></i> Ürün Ekle
                </Link>
              </li>
              <li>
                <Link to="/product-list" className="nav-link text-white py-1" onClick={handleLinkClick}>
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
            <ul className="submenu list-unstyled ps-4">
              <li>
                <Link to="/customer-add" className="nav-link text-white py-1" onClick={handleLinkClick}>
                  <i className="bi bi-plus-circle me-2"></i> Müşteri Ekle
                </Link>
              </li>
              <li>
                <Link to="/customer-list" className="nav-link text-white py-1" onClick={handleLinkClick}>
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
            <ul className="submenu list-unstyled ps-4">
              <li>
                <Link to="/order-add" className="nav-link text-white py-1" onClick={handleLinkClick}>
                  <i className="bi bi-plus-circle me-2"></i> Sipariş Ekle
                </Link>
              </li>
              <li>
                <Link to="order-list" className="nav-link text-white py-1" onClick={handleLinkClick}>
                  <i className="bi bi-list-ul me-2"></i> Sipariş Listesi
                </Link>
              </li>
            </ul>
          )}
        </li>
        {/* --- Ödeme --- */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-white d-flex align-items-center justify-content-between"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu("odeme");
            }}
            role="button"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-wallet me-2"></i>
              {!collapsed && <span>Ödemeler</span>}
            </div>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${
                  openMenu === "ödeme" ? "up" : "down"
                }`}
              ></i>
            )}
          </a>
          {!collapsed && openMenu === "odeme" && (
            <ul className="submenu list-unstyled ps-4">
              <li>
                <Link to="/payment-list" className="nav-link text-white py-1" onClick={handleLinkClick}>
                  <i className="bi bi-list-ul me-2"></i> Ödemeler
                </Link>
              </li>
              <li>
                <Link
                  to="/completed-payment"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-check2-circle me-2"></i> Tamamlanmış
                  Ödemeler
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* --- Haraket --- */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-white d-flex align-items-center justify-content-between"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu("hareket");
            }}
            role="button"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-arrow-left-right me-2"></i>
              {!collapsed && <span>Haraket</span>}
            </div>
            {!collapsed && (
              <i
                className={`bi bi-chevron-${
                  openMenu === "hareket" ? "up" : "down"
                }`}
              ></i>
            )}
          </a>
          {!collapsed && openMenu === "hareket" && (
            <ul className="submenu list-unstyled ps-4">
              {/* 🐞 Hata Düzeltme: 'Link > li' yapısını 'li > Link' olarak düzelttim */}
              <li>
                <Link
                  to="/stock-movement-list"
                  className="nav-link text-white py-1"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-list-ul me-2"></i> Stok Hareketleri
                </Link>
              </li>
            </ul>
          )}
        </li> 
      </ul>
    </div>
  );
}

export default SideBar;
