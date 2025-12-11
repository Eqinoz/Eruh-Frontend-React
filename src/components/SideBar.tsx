import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import "./css/SideBar.css";

interface SideBarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

function SideBar({ isMobileOpen, onCloseMobile }: SideBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { userRole } = useSelector((state: RootState) => state.auth);

  // Bu rol bu içeriği görebilir mi?
  const canAccess = (allowedRoles: string[]) => {
    if (!userRole) return false;
    const userRolesArray = Array.isArray(userRole) ? userRole : [userRole];
    
    // Admin ve Yönetici her kapıyı açar (Master Key)
    if (userRolesArray.includes("Admin") || userRolesArray.includes("Yönetici")) return true;
    
    // Diğerleri kontrol edilir
    return userRolesArray.some(r => allowedRoles.includes(r));
  };

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onCloseMobile();
    }
  };

  return (
    <div className={`sidebar-fistik text-white p-2 d-flex flex-column ${collapsed ? "collapsed" : ""} ${isMobileOpen ? "show-mobile" : ""}`}>
      
      {/* HEADER */}
      <div className="sidebar-header d-flex align-items-center justify-content-between px-2 mb-3">
        {!collapsed && <h5 className="m-0 fw-bold fistik-title">Fıstık Pazarı</h5>}
        <button className="btn btn-sm btn-outline-light toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <i className="bi bi-chevron-double-right"></i> : <i className="bi bi-chevron-double-left"></i>}
        </button>
      </div>

      <ul className="nav flex-column">
        
        {/* --- ANASAYFA (Kavurmacı HARİÇ Herkes) --- */}
        {/* Kavurmacı finansal verileri görmesin diye gizledik */}
        {canAccess(["Satışçı", "Çalışan", "Paketleyici"]) && (
          <li className="nav-item">
            <Link to="/" className="nav-link text-white d-flex align-items-center" onClick={handleLinkClick}>
              <i className="bi bi-speedometer2 me-2"></i>
              {!collapsed && <span>Anasayfa</span>}
            </Link>
          </li>
        )}

        {/* --- STOKLAR & ÜRETİM (Kavurmacı, Admin, Yönetici) --- */}
        {/* Ana başlığı Kavurmacı da görsün ama içini filtreleyeceğiz */}
        {canAccess(["Kavurmacı"]) && (
          <li className="nav-item">
            <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("stok"); }} role="button">
              <div className="d-flex align-items-center">
                <i className="bi bi-box-seam me-2"></i>
                {!collapsed && <span>Üretim & Stok</span>}
              </div>
              {!collapsed && <i className={`bi bi-chevron-${openMenu === "stok" ? "up" : "down"}`}></i>}
            </a>
            {!collapsed && openMenu === "stok" && (
              <ul className="submenu list-unstyled ps-4">
                
                {/* 1. Hazır Stok: Sadece Yönetim ve Satış Görsün (Kavurmacı Görmesin) */}
                {canAccess(["Satışçı"]) && (
                    <li><Link to="/stock-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-eye me-2"></i> Detaylı Stok Listesi</Link></li>
                )}

                {/* 2. Ham Madde Ekle: Sadece Yönetim (Kavurmacı Görmesin) */}
                <li className="submenu-divider" />

                {/* 3. Ham Maddeler Listesi: Kavurmacı Görsün (İşlem yapacak) */}
                <li><Link to="/rawmaterial-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-list-ul me-2"></i> Ham Maddeler</Link></li>
                
                <li className="submenu-divider" />
                
                {/* 4. İşlemdekiler & İşlenmiş: Kavurmacı Görsün */}
                <li><Link to="/productToProcessed" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-gear-wide-connected me-2"></i> İşlemdekiler</Link></li>
                <li><Link to="/processedproduct" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-check2-square me-2"></i> İşlenmiş Ürünler</Link></li>
                
                <hr className="submenu-divider" />
                
                {/* 5. Paketlenme: Kavurmacı veya Paketleyici Görsün */}
                <li><Link to="/to-be-packaged" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-box2-fill me-2"></i> Paketlenme</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* --- MAHALLE (Herkes veya Kavurmacı) --- */}
        <li className="nav-item">
          <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("mahalle"); }} role="button">
            <div className="d-flex align-items-center"><i className="bi bi-shop me-2"></i>{!collapsed && <span>Mahalle</span>}</div>
            {!collapsed && <i className={`bi bi-chevron-${openMenu === "mahalle" ? "up" : "down"}`}></i>}
          </a>
          {!collapsed && openMenu === "mahalle" && (
            <ul className="submenu list-unstyled ps-4">
              <li><Link to="/neighborhood-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-list-ul me-2"></i> Mahalledeki Ürünler</Link></li>
            </ul>
          )}
        </li>

        {/* --- FASONCU / KOMİSYONCU (Kavurmacı, Admin) --- */}
        {canAccess(["Admin", "Yönetici"]) && (
          <li className="nav-item">
            <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("contractor"); }} role="button">
              <div className="d-flex align-items-center"><i className="bi bi-briefcase-fill me-2"></i>{!collapsed && <span>Fason/Komisyon</span>}</div>
              {!collapsed && <i className={`bi bi-chevron-${openMenu === "contractor" ? "up" : "down"}`}></i>}
            </a>
            {!collapsed && openMenu === "contractor" && (
              <ul className="submenu list-unstyled ps-4">
                {/* Ekleme yetkisi sadece yönetimde olsun mu? Şimdilik Kavurmacı da eklesin dedim ama istersen kısıtla */}
                <li><Link to="/contractor-add" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-plus-circle me-2"></i> Fason/Komisyon Ekle</Link></li>
                <li><Link to="/contractor-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-list-ul me-2"></i> Fason/Komisyon Liste</Link></li>
                <hr className="submenu-divider" />
                <li><Link to="/contractor-products" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-box-seam me-2"></i> Fason/Komisyondaki Ürünleri</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* --- ÜRÜNLER (Admin, Yönetici - Sadece Tanımlama) --- */}
        {canAccess(["Admin", "Yönetici"]) && (
          <li className="nav-item">
            <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("urun"); }} role="button">
              <div className="d-flex align-items-center"><i className="bi bi-clipboard-check-fill me-2"></i>{!collapsed && <span>Satışa Hazır Ürünler</span>}</div>
              {!collapsed && <i className={`bi bi-chevron-${openMenu === "urun" ? "up" : "down"}`}></i>}
            </a>
            {!collapsed && openMenu === "urun" && (
              <ul className="submenu list-unstyled ps-4">
                <li><Link to="/product-add" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-plus-circle me-2"></i> Ürün Ekle</Link></li>
                <li><Link to="/product-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-eye me-2"></i> Ürünleri Gör</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* --- MÜŞTERİLER (Satışçı, Admin) --- */}
        {canAccess(["Satışçı"]) && (
          <li className="nav-item">
            <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("musteri"); }} role="button">
              <div className="d-flex align-items-center"><i className="bi bi-person-circle me-2"></i>{!collapsed && <span>Müşteriler</span>}</div>
              {!collapsed && <i className={`bi bi-chevron-${openMenu === "musteri" ? "up" : "down"}`}></i>}
            </a>
            {!collapsed && openMenu === "musteri" && (
              <ul className="submenu list-unstyled ps-4">
                <li><Link to="/customer-add" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-plus-circle me-2"></i> Müşteri Ekle</Link></li>
                <li><Link to="/customer-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-list-ul me-2"></i> Müşteri Listesi</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* --- SİPARİŞLER & FİNANS (Satışçı, Admin) --- */}
        {canAccess(["Satışçı"]) && (
          <>
            <li className="nav-item-header text-muted small fw-bold mt-3 ms-2">{!collapsed && "SATIŞ & FİNANS"}</li>
            
            <li className="nav-item">
              <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("siparis"); }} role="button">
                <div className="d-flex align-items-center"><i className="bi bi-cart-check-fill me-2"></i>{!collapsed && <span>Siparişler</span>}</div>
                {!collapsed && <i className={`bi bi-chevron-${openMenu === "siparis" ? "up" : "down"}`}></i>}
              </a>
              {!collapsed && openMenu === "siparis" && (
                <ul className="submenu list-unstyled ps-4">
                  <li><Link to="/order-add" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-plus-circle me-2"></i> Sipariş Ekle</Link></li>
                  <hr className="submenu-divider" />
                  <li><Link to="/order-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-list-ul me-2"></i> Sipariş Listesi</Link></li>
                  <hr className="submenu-divider" />
                  <li><Link to="/past-orders" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-clock-history me-2"></i> Geçmiş Siparişler</Link></li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("odeme"); }} role="button">
                <div className="d-flex align-items-center"><i className="bi bi-wallet me-2"></i>{!collapsed && <span>Ödemeler</span>}</div>
                {!collapsed && <i className={`bi bi-chevron-${openMenu === "odeme" ? "up" : "down"}`}></i>}
              </a>
              {!collapsed && openMenu === "odeme" && (
                <ul className="submenu list-unstyled ps-4">
                  <li><Link to="/payment-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-hourglass-split me-2"></i> Bekleyenler</Link></li>
                  <li><Link to="/completed-payment" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-check2-circle me-2"></i> Tamamlananlar</Link></li>
                </ul>
              )}
            </li>
          </>
        )}
        
        {/* --- HAREKETLER (Kavurmacı ve Satışçı Görsün) --- */}
        {canAccess(["Admin", "Yönetici"]) && (
        <li className="nav-item">
          <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("hareket"); }} role="button">
            <div className="d-flex align-items-center"><i className="bi bi-arrow-left-right me-2"></i>{!collapsed && <span>Hareketler</span>}</div>
            {!collapsed && <i className={`bi bi-chevron-${openMenu === "hareket" ? "up" : "down"}`}></i>}
          </a>
          {!collapsed && openMenu === "hareket" && (
            <ul className="submenu list-unstyled ps-4">
              <li><Link to="/stock-movement-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-activity me-2"></i> Stok Hareketleri</Link></li>
            </ul>
          )}
        </li>
        )}

        {/* --- YÖNETİM --- */}
        {canAccess(["Admin", "Yönetici"]) && (
            <>
            <li className="nav-item-header text-muted small fw-bold mt-3 ms-2">
                {!collapsed && "YÖNETİM"}
            </li>
            <li className="nav-item">
            <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("personel"); }} role="button">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-workspace me-2"></i>
                {!collapsed && <span>Personel İşlemleri</span>}</div>
              {!collapsed && <i className={`bi bi-chevron-${openMenu === "personel" ? "up" : "down"}`}></i>}
            </a>
            {!collapsed && openMenu === "personel" && (
              <ul className="submenu list-unstyled ps-4">
                <li><Link to="/user-add" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-person-plus-fill me-2"></i> Personel Ekle</Link></li>
                <li><Link to="/user-list" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-people-fill me-2"></i> Personel Listesi</Link></li>
              </ul>
            )}
          </li>
          
          {/* Paketleme Tipleri */}
          <li className="nav-item">
            <Link to="/packaging-types" className="nav-link text-white d-flex align-items-center" onClick={handleLinkClick}>
              <i className="bi bi-box me-2"></i>
              {!collapsed && <span>Paketleme Tipleri</span>}
            </Link>
          </li>
          {/* Üretim & Stok Ayarları */}
          <li className="nav-item">
            <a href="#" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={(e) => { e.preventDefault(); toggleMenu("uretimayar"); }} role="button">
              <div className="d-flex align-items-center">
                <i className="bi bi-gear-fill me-2"></i>
                {!collapsed && <span>Üretim & Stok Ayarları</span>}
              </div>
              {!collapsed && <i className={`bi bi-chevron-${openMenu === "uretimayar" ? "up" : "down"}`}></i>}
            </a>
            {!collapsed && openMenu === "uretimayar" && (
              <ul className="submenu list-unstyled ps-4">
                <li><Link to="/rawmaterial-add" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-plus-circle me-2"></i>Ham Madde Ekle</Link></li>
                <hr className="submenu-divider my-1" />
                <li><Link to="/rawmaterial-edit" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-pencil-square me-2"></i>Ham Maddeler</Link></li>
                <li><Link to="/processing-edit" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-pencil-square me-2"></i>İşlemdeki Ürünler</Link></li>
                <li><Link to="/processed-product-edit" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-pencil-square me-2"></i>İşlenmiş Ürünler</Link></li>
                <li><Link to="/to-packaged-edit" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-pencil-square me-2"></i>Paketlenecek Ürünler</Link></li>
                <li><Link to="/product-edit" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-pencil-square me-2"></i>Satışa Hazır Ürünler</Link></li>
                <li><Link to="/neighborhood-edit" className="nav-link text-white py-1" onClick={handleLinkClick}><i className="bi bi-pencil-square me-2"></i>Mahalledeki Ürünler</Link></li>
              </ul>
            )}
          </li>
          </>
        )}

        

      </ul>
    </div>
  );
}

export default SideBar;