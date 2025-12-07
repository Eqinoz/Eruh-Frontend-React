import { useState } from "react";
import { useLoginMutation } from "../services/authService";
import type { TokenResponse } from "../models/tokenModel";
import { useDispatch } from "react-redux"; 
import { setToken } from "../store/store"; 
import "./css/Login.css"; 
import appLogo from "../assets/eruh_logo.jpg"
function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: TokenResponse = await login(loginData).unwrap();
      dispatch(setToken(result.data.token));
    } catch (err: any) {
      console.error("Giriş başarısız oldu:", err);
      // Hata mesajı artık 'error' state'i üzerinden yönetiliyor
    }
  };

  return (
    <div className="login-page-wrapper d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="login-form p-4 border rounded bg-white shadow-lg"
      >
        <img src={appLogo} alt="Eruh Logo" width={200}  className="img-fluid d-block mx-auto" />
        <span className="playwrite-hu-headertitle fistik-title mb-4 d-block text-center"></span>
        <h4 className="text-center mb-4 text-muted">Yönetim Paneli Girişi</h4>

        {/* ⭐️ HATA DÜZELTME: Error objesinin tipini kontrol ediyoruz */}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {/* RTK Query'den gelen bir hata mı? */}
            {
              "data" in error &&
              error.data &&
              typeof error.data === "object" &&
              "message" in error.data
                ? (error.data as any).message // Eğer varsa message'ı göster
                : "E-posta veya şifre hatalı." // Yoksa varsayılan mesajı göster
            }
          </div>
        )}

        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-envelope-fill"></i>
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="E-posta"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required // HTML5 doğrulama ekledim
          />
        </div>

        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-lock-fill"></i>
          </span>
          <input
            type="password"
            className="form-control"
            placeholder="Şifre"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required // HTML5 doğrulama ekledim
          />
        </div>

        <button className="btn btn-primary-fistik w-100" disabled={isLoading}>
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Giriş Yapılıyor...
            </>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
