// src/components/Header.tsx

import { useDispatch } from "react-redux";
import { getUserNameFromToken } from "../utilities/tokenHelper";
import { clearToken } from "../store/store"; // 👈 1. REDUX LOGOUT EYLEMİNİ İMPORT ET
import "./css/Header.css"; // 👈 2. YENİ CSS DOSYAMIZI İMPORT ET

function Header() {
  // 🐞 3. HATA DÜZELTME: 'useNavigate' değil, 'useDispatch' lazım.
  const dispatch = useDispatch();

  const handleLogout = () => {
    // ⭐️ 4. PROFESYONEL LOGOUT:
    // Sayfayı yenilemek yerine, Redux store'daki token'ı sil.
    // App.tsx'teki <Routes> mantığı değişikliği yakalayıp
    // otomatik olarak LoginPage'e yönlendirecek.
    dispatch(clearToken());
  };

  return (
    // 🐞 5. HATA DÜZELTME: Gereksiz '<>' (Fragment) kaldırıldı.
    <header>
      {/* 🎨 6. TEMA: 'bg-dark' yerine 'navbar-fistik' temamızı uyguladım */}
      <nav className="navbar navbar-fistik px-4 d-flex justify-content-between align-items-center">
        {/* Sol kısım - Logo + İsim */}
        <div className="d-flex align-items-center">
          {/* Logo */}
          {/* <img ... /> */}

          {/* 🎨 7. TEMA: Proje adına altın rengi için özel sınıf ekledim */}
          <span className="playwrite-hu-headertitle fistik-logo-title">
            Eruh Fıstık Pazarı
          </span>
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
