import React, { useState } from "react";
import { useAddRawMaterialMutation } from "../services/rawMaterialService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./css/RawMaterialList.css";
import "./css/Modal.css";
import "./css/Forms.css";

function RawMaterialAdd() {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    incomingAmount: 0,
    neighborhoodInComingAmount: 0,
  });

  // 🐞 2. Artık 'isSuccess', 'isError' vb. gerek yok, 'unwrap' kullanıyoruz.
  const [addRawMaterial, { isLoading }] = useAddRawMaterialMutation();
  const navigate = useNavigate();

  // ⭐️ Tipleri 'any' yerine daha net belirttim
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "incomingAmount" ? parseInt(value, 10) || 0 : value,
    }));
  };

  // ⭐️ Submit mantığını 'toastify' ile güncelledim
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || formData.incomingAmount < 0) {
      // 🐞 3. 'alert()' yerine 'toast.warn()'
      toast.warn("Lütfen 'Ham Madde Adı' ve 0'dan büyük bir 'Stok' girin.");
      return;
    }

    try {
      await addRawMaterial(formData).unwrap();

      // 🐞 4. 'useEffect' yerine başarı anında doğrudan toast ve yönlendirme
      toast.success(`"${formData.name}" adlı ham madde başarıyla eklendi!`);
      navigate("/rawmaterial-list"); // 👈 Sidebar'daki doğru yola yönlendir
    } catch (err: any) {
      // 🐞 5. Hata mesajını 'toast.error()' ile göster
      console.error("Ham madde eklenemedi: ", err);
      toast.error(err.data?.message || "Beklenmeyen bir hata oluştu.");
    }
  };

  // 🐞 6. 'isSuccess'e bağlı 'useEffect' bloğu SİLİNDİ.

  return (
    // 🎨 7. Layout'u 'container-fluid' olarak güncelledim
    <div className="container-fluid px-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            {/* 🎨 8. Kart başlığını temamıza uygun hale getirdim */}
            <div className="card-header card-header-fistik text-white">
              <h5 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>Yeni Ham Madde Ekle
              </h5>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">
                    Ham Madde Adı
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Açıklama
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="incomingAmount"
                    className="form-label fw-bold"
                  >
                    Başlangıç Stoku (kg)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="incomingAmount"
                    name="incomingAmount"
                    placeholder="0.00"
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <hr />

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  {/* 🎨 9. Butonları temamıza uygun hale getirdim */}
                  <button
                    type="button"
                    className="btn btn-fistik-secondary me-md-2"
                    onClick={() => navigate("/rawmaterial-list")} // 👈 Yolu düzelttim
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-fistik-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>

                {/* 🐞 10. 'isError' ile hata gösterme bloğu SİLİNDİ. */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RawMaterialAdd;
