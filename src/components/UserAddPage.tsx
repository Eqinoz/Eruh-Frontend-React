import { useState } from "react";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../services/authService";

// Temalar
import "./css/Forms.css";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function UserAddPage() {
  const [register, { isLoading }] = useRegisterMutation();


  // Form Verileri
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    titleName: "", // 👈 Rol burada seçilecek
    phone: "" // Opsiyonel
  });

  // Roller Listesi (Senin sistemindeki yetkiler)
  const roles = [
    { value: "Yönetici", label: "Yönetici" },
    { value: "Kavurmacı", label: "Üretim Sorumlusu (Kavurmacı)" },
    { value: "Satisci", label: "Satış Personeli" },
    { value: "Paketleyici", label: "Paketleme Personeli" },
    { value: "Çalışan", label: "Standart Çalışan" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basit Validasyon
    if (!formData.mail || !formData.password || !formData.titleName || !formData.firstName) {
      toast.warn("Lütfen zorunlu alanları doldurunuz.");
      return;
    }

    try {
      // Backend'e gönder
      console.log(formData);
      await register(formData).unwrap();
      
      toast.success(`${formData.firstName} ${formData.lastName} başarıyla sisteme eklendi! 🎉`);
      
      // Formu temizle veya yönlendir
      setFormData({ firstName: "", lastName: "", mail: "", password: "", titleName: "", phone: "" });
      // navigate("/"); // İstersen anasayfaya yönlendir
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Kullanıcı oluşturulamadı. E-posta kullanımda olabilir.");
    }
  };

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            
            {/* Header */}
            <div className="card-header card-header-fistik text-white">
              <h5 className="mb-0">
                <i className="bi bi-person-plus-fill me-2"></i>Yeni Kullanıcı / Personel Ekle
              </h5>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Ad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Soyad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">E-Posta Adresi (Kullanıcı Adı)</label>
                  <input
                    type="email"
                    className="form-control"
                    name="mail"
                    value={formData.mail}
                    onChange={handleChange}
                    required
                    placeholder="ornek@eruhfistik.com"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Şifre</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="******"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-success">Yetki / Rol</label>
                    <select
                      className="form-select border-success"
                      name="titleName"
                      value={formData.titleName}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Yetki Seçiniz --</option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted" style={{fontSize: '0.75rem'}}>
                       * Kullanıcının erişebileceği sayfaları belirler.
                    </small>
                  </div>
                </div>

                <div className="mb-4">
                    <label className="form-label fw-bold">Telefon (Opsiyonel)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XX XXX XX XX"
                    />
                </div>

                <hr />

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-fistik-primary py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Kullanıcı Oluşturuluyor...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-save2 me-2"></i>Kullanıcıyı Kaydet
                        </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAddPage;