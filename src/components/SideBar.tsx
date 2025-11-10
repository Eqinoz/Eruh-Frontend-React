import { useState } from "react";
import { Link } from "react-router-dom";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu: any) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`sidebar bg-dark text-white p-2 d-flex flex-column ${
          collapsed ? "collapsed" : ""
        }`}
      >
        <div className="d-flex align-items-center justify-content-between px-2 mb-3">
          {!collapsed && <h5 className="m-0 fw-bold">Menü</h5>}
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

          {/* Stok */}
          <li className="nav-item">
            <div
              className="nav-link text-white d-flex align-items-center justify-content-between"
              onClick={() => toggleMenu("stok")}
              style={{ cursor: "pointer" }}
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
            </div>
            {!collapsed && openMenu === "stok" && (
              <ul className="submenu list-unstyled ps-4">
                <Link to="/stok-add">
                  <li>
                    <a href="" className="nav-link text-white py-1">
                      <i className="bi bi-plus-circle me-2"></i> Ham Madde Ekle
                    </a>
                  </li>
                </Link>
                <Link to="/stok-list">
                  <li>
                    <a className="nav-link text-white py-1">
                      <i className="bi bi-eye me-2"></i> Ham Maddeleri Görüntüle
                    </a>
                  </li>
                </Link>
              </ul>
            )}
          </li>
          {/* Mahalle*/}
          <li className="nav-item">
            <div
              className="nav-link text-white d-flex align-items-center justify-content-between"
              onClick={() => toggleMenu("mahalle")}
              style={{ cursor: "pointer" }}
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
            </div>
            {!collapsed && openMenu === "mahalle" && (
              <ul className="submenu list-unstyled ps-4">
                <Link to="/neighborhood-list">
                  <li>
                    <a href="" className="nav-link text-white py-1">
                      <i className="bi bi-list-ul me-2"></i> Mahalledeki Ürünler
                    </a>
                  </li>
                </Link>
              </ul>
            )}
          </li>

          {/* Ürünler */}
          <li className="nav-item">
            <div
              className="nav-link text-white d-flex align-items-center justify-content-between"
              onClick={() => toggleMenu("urun")}
              style={{ cursor: "pointer" }}
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
            </div>
            {!collapsed && openMenu === "urun" && (
              <ul className="submenu list-unstyled ps-4">
                <Link to="/product-add">
                  <li>
                    <a href="" className="nav-link text-white py-1">
                      <i className="bi bi-plus-circle me-2"></i> Ürün Ekle
                    </a>
                  </li>
                </Link>
                <Link to="/product-list">
                  <li>
                    <a className="nav-link text-white py-1">
                      <i className="bi bi-eye me-2"></i> Ürünleri Görüntüle
                    </a>
                  </li>
                </Link>
              </ul>
            )}
          </li>

          {/* Müşteriler */}
          <li className="nav-item">
            <div
              className="nav-link text-white d-flex align-items-center justify-content-between"
              onClick={() => toggleMenu("musteri")}
              style={{ cursor: "pointer" }}
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
            </div>
            {!collapsed && openMenu === "musteri" && (
              <ul className="submenu list-unstyled ps-4">
                <li>
                  <Link to="/customer-add" className="nav-link text-white py-1">
                    <i className="bi bi-plus-circle me-2"></i> Müşteri Ekle
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer-list"
                    className="nav-link text-white py-1"
                  >
                    <i className="bi bi-list-ul me-2"></i> Müşteri Listesi
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <div
              className="nav-link text-white d-flex align-items-center justify-content-between"
              onClick={() => toggleMenu("siparis")}
              style={{ cursor: "pointer" }}
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
            </div>
            {!collapsed && openMenu === "siparis" && (
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

      {/* İçerik */}
    </div>
  );
}

export default SideBar;
