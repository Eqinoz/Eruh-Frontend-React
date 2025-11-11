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
        <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between align-items-center">
          {/* Sol kısım - Logo + İsim */}
          <div className="d-flex align-items-center">
            {/* Logo */}
            {/* <img
              src="../assets/eruh_logo.svg"
              alt="logo"
              className="me-2 header-logo"
            /> */}
            {/* Proje adı */}
            <span className=" playwrite-hu-headertitle">
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
            <ul className="dropdown-menu  ">
              <li>
                <a className="dropdown-item">Profil</a>
              </li>
              <li>
                <a className="dropdown-item">Another action</a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item text-danger" onClick={handleLogout}>
                  Çıkış Yap
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
