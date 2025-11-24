import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🎨 Yönlendirme için
import { toast } from "react-toastify"; // 🎨 Bildirimler için
import { useAddCustomerMutation } from "../services/customerService";

// 🎨 Temalarımızı import ediyoruz
import "./css/Forms.css";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function CustomerAdd() {
  // 🎨 isLoading durumunu da alıyoruz ki butonu yönetelim
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: 0,
    customerName: "",
    taxNumber: "",
    relevantPerson: "",
    contactNumber: "",
    address: "",
    contactMail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basit bir validasyon
    if (!formData.customerName) {
      toast.warn("Lütfen Müşteri Adını giriniz.");
      return;
    }

    try {
      await addCustomer(formData).unwrap();

      // 🎨 Başarılı olursa toast göster ve listeye dön
      toast.success(`"${formData.customerName}" başarıyla eklendi!`);
      navigate("/customer-list");
    } catch (error: any) {
      // 🎨 Hata olursa toast göster
      console.error(error);
      toast.error(error.data?.message || "Müşteri eklenirken bir hata oluştu.");
    }
  };

  return (
    // 🎨 Layout düzenlemesi
    <div className="container-fluid px-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {" "}
          {/* Formu çok genişletmemek için */}
          <div className="card shadow-lg border-0">
            {/* 🎨 Kart Başlığı - Fıstık Teması */}
            <div className="card-header card-header-fistik text-white">
              <h5 className="mb-0">
                <i className="bi bi-person-plus-fill me-2"></i>Yeni Müşteri Ekle
              </h5>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    {/* 🎨 Label'ları Forms.css ile güzelleştiriyoruz */}
                    <label className="form-label fw-bold">Müşteri Adı</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Vergi Numarası</label>
                    <input
                      type="text"
                      className="form-control"
                      name="taxNumber"
                      value={formData.taxNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      İletişim Kişisi
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="relevantPerson"
                      value={formData.relevantPerson}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Telefon</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">E-Posta</label>
                  <input
                    type="email"
                    className="form-control"
                    name="contactMail"
                    value={formData.contactMail}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Adres</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  ></textarea>
                </div>

                <hr />

                {/* 🎨 Buton Grubu - Fıstık Teması */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-fistik-secondary me-md-2"
                    onClick={() => navigate("/customer-list")}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-fistik-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i> Kaydet
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

export default CustomerAdd;
