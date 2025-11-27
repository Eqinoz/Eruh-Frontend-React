import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için
import { toast } from "react-toastify"; // Bildirimler için

// Servis ve Modeller (Dosya yollarını kontrol et ciğerim)
import { useAddContractorMutation } from "../services/contractorService"; 
// import type { ContractorModel } from "../models/contractorModel"; // Tip güvenliği istersen aç

// 🎨 Temalarımızı import ediyoruz
import "./css/Forms.css";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function ContractorAdd() {
  // API Hook'u (isLoading ile butonu kontrol edeceğiz)
  const [addContractor, { isLoading }] = useAddContractorMutation();
  
  const navigate = useNavigate();

  // Form State'i
  const [formData, setFormData] = useState({
    id: 0,
    companyName: "", // Müstahsil/Tedarikçi Adı (Modelde customerName olarak geçiyor)
    taxNumber: "",
    relevantPerson: "",  // İlgili Kişi (Modelde relevantPerson)
    contactNumber: "",
    address: "",
    contactMail: "", // E-posta (Modelde contactMail)
  });

  // Input Değişikliklerini Yakala
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kaydetme İşlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasyon
    if (!formData.companyName) {
      toast.warn("Lütfen Müstahsil/Tedarikçi Adını giriniz.");
      return;
    }

    try {
      await addContractor(formData).unwrap();
      
      // Başarılı olursa
      toast.success(`"${formData.companyName}" başarıyla eklendi!`);
      navigate("/contractor-list"); // Listeye geri dön
      
    } catch (error: any) {
      // Hata olursa
      console.error(error);
      toast.error(error.data?.message || "Müstahsil eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8"> 
          <div className="card shadow-lg border-0">
            
            {/* 🎨 Kart Başlığı - Fıstık Teması */}
            <div className="card-header card-header-fistik text-white">
              <h5 className="mb-0">
                {/* İkonu değiştirdim: Person Gear (Tedarikçi/Çalışan havası versin) */}
                <i className="bi bi-person-fill-gear me-2"></i>Yeni Müstahsil Ekle
              </h5>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Müstahsil/Firma Adı</label>
                    <input
                      type="text"
                      className="form-control"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      autoFocus
                      placeholder="Örn: Yılmaz Tarım Ltd."
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
                      placeholder="Varsa giriniz"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">İlgili Kişi</label>
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
                      placeholder="05XX XXX XX XX"
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
                    onClick={() => navigate("/contractor-list")}
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
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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

export default ContractorAdd;