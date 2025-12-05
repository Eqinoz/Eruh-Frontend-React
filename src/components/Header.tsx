// src/components/Header.tsx

import { useDispatch } from "react-redux";
import { getUserNameFromToken } from "../utilities/tokenHelper";
import { clearToken } from "../store/store";
import "./css/Header.css";
import { Link } from "react-router-dom";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

function Header({ onToggleMobileSidebar }: HeaderProps) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearToken());
  };

  return (
    <header>
      <nav className="navbar navbar-fistik px-3 px-md-4 d-flex justify-content-between align-items-center">
        {/* Sol kısım - Hamburger + Logo */}
        <div className="d-flex align-items-center gap-3">
          {/* Hamburger Menu - Sadece mobilde görünür */}
          <button
            className="btn btn-link text-white p-0 d-md-none"
            onClick={onToggleMobileSidebar}
            aria-label="Menüyü Aç/Kapat"
          >
            <i className="bi bi-list fs-2"></i>
          </button>

          {/* Logo/Başlık */}
          <Link to={"/"}>
          <span className="playwrite-hu-headertitle fistik-logo-title">
            Eruh Fıstık Pazarı
          </span>
          </Link>
        </div>

        {/* Sağ kısım - Kullanıcı adı */}
        <div className="d-flex align-items-center dropdown">
          <i className="bi bi-person-circle me-2 fs-5 text-white"></i>
          <button
            className="text-white fw-semibold dropdown-toggle bg-transparent border-0"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {getUserNameFromToken()}
          </button>

          {/* 🎨 8. TEMA: Dropdown menüyü de koyu temaya uygun hale getirdim */}
          <ul className="dropdown-menu dropdown-menu-dark">
            <li>
              {/* ⭐️ 9. İYİLEŞTİRME: Link olmayan 'a' etiketlerini 'button' yaptım */}
              <button className="dropdown-item">
                <i className="bi bi-person-fill me-2"></i>Profil
              </button>
            </li>
            <li>
              <button className="dropdown-item">
                <i className="bi bi-gear-fill me-2"></i>Ayarlar
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
