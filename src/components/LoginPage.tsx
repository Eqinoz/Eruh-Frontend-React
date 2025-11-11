import { useState } from "react";
import { useLoginMutation } from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { TokenResponse } from "../models/tokenModel";

function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: TokenResponse = await login(loginData).unwrap();
      localStorage.setItem("token", result.data.token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert("Giriş başarısız!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded bg-white"
        style={{ width: 350 }}
      >
        <span className=" playwrite-hu-headertitle  mb-4 d-block text-center">
          Eruh Fıstık Pazarı
        </span>
        <h4 className="text-center mb-3">Giriş Yap</h4>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="E-posta"
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Şifre"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
        <button className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
