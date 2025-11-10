import { useNavigate } from "react-router-dom";
import { getUserNameFromToken } from "../utilities/tokenHelper";

function Header() {
  const navigate = useNavigate;
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <>
      <header>
        <div className="px-2 py-0 border-bottom mb-0">
          <div className="text-end">
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
        <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between align-items-center">
          {/* Sol kısım - Logo + İsim */}
          <div className="d-flex align-items-center">
            {/* Logo */}
            <img
              src="../assets/eruh_logo.svg"
              alt="logo"
              className="me-2 header-logo"
            />
            {/* Proje adı */}
            <span className="navbar-brand mb-0 h5 text-white">
              Eruh Fıstık Pazarı
            </span>
          </div>

          {/* Sağ kısım - Kullanıcı adı */}
          <div className="d-flex align-items-center">
            <i className="bi bi-person-circle me-2 fs-5 text-white"></i>
            <span className="text-white fw-semibold">
              {getUserNameFromToken()}
            </span>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
