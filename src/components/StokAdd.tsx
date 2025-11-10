import React, { useState, useEffect } from "react";
// RTK Query servisimizden 'add' (ekleme) mutation'ını import ediyoruz.
// İsmi 'useAddNewRawMaterialMutation' veya benzeri olabilir, kendi servis dosyanıza göre düzeltmelisiniz.
import { useAddRawMaterialMutation } from "../services/rawMaterialService";
import { useNavigate } from "react-router-dom"; // Kayıttan sonra yönlendirme için

function StokAdd() {
  // Form verilerini tutmak için 'state' kullanıyoruz
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    // 'incomingAmount' (Gelen Stok) listelemede kullanılıyordu,
    // yeni bir ham madde eklerken 'başlangıç stoku' olarak düşünebiliriz.
    // Başlangıç değeri olarak 0 veriyoruz.
    incomingAmount: 0,
  });

  // RTK Query mutation hook'u
  // addRawMaterial: Veriyi gönderecek tetikleyici fonksiyon
  // { isLoading, isSuccess, isError, error }: API isteğinin durumları
  const [addRawMaterial, { data: any, isLoading, isSuccess, isError, error }] =
    useAddRawMaterialMutation();

  // React Router'dan navigate fonksiyonunu alıyoruz
  const navigate = useNavigate();

  // Formdaki her değişiklikte 'state'i güncelleyen fonksiyon
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      // 'incomingAmount' ise değeri sayıya çeviriyoruz, değilse metin olarak alıyoruz
      [name]: name === "incomingAmount" ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Form gönderildiğinde (submit) çalışacak fonksiyon
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    // Basit bir doğrulama
    if (!formData.name || formData.incomingAmount < 0) {
      alert("Lütfen 'Ham Madde Adı' ve 0'dan büyük bir 'Stok' girin.");
      return;
    }

    try {
      // RTK Query'nin 'addRawMaterial' fonksiyonunu form verisiyle çağırıyoruz
      // .unwrap() sayesinde hata olması durumunda 'catch' bloğu çalışacak
      await addRawMaterial(formData).unwrap();

      // Başarılı olursa formu temizle (state'i sıfırla)
      setFormData({ id: 0, name: "", description: "", incomingAmount: 0 });

      // (Opsiyonel) Başarı mesajı gösterebilir veya listeye yönlendirebilirsiniz
      // navigate("/stoklistesi"); // Listenin olduğu URL'ye yönlendir
    } catch (err) {
      // Hata durumunda konsola yazdır
      console.error("Ham madde eklenemedi: ", err);
    }
  };

  // Hata mesajını kullanıcı dostu hale getirme

  // 'isSuccess' (başarı durumu) değiştiğinde ve true olduğunda çalışır
  useEffect(() => {
    if (isSuccess) {
      // Başarılı ekleme sonrası stok listesine yönlendir
      // 'react-router-dom' kullanmıyorsanız bu kısmı yoruma alabilirsiniz.
      navigate("/stok-list"); // Yönlenecek sayfanın yolunu (path) yazın
    }
  }, [isSuccess, navigate]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            {/* Kart Başlığı */}
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Yeni Ham Madde Ekle</h5>
            </div>

            {/* Form Alanı */}
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* 1. Alan: Ham Madde Adı */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">
                    Ham Madde Adı
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name" // State'deki 'name' ile eşleşmeli
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* 2. Alan: Açıklama */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Açıklama
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description" // State'deki 'description' ile eşleşmeli
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* 3. Alan: Başlangıç Stoku */}
                <div className="mb-3">
                  <label
                    htmlFor="incomingAmount"
                    className="form-label fw-bold"
                  >
                    Başlangıç Stoku
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="incomingAmount"
                    name="incomingAmount" // State'deki 'incomingAmount' ile eşleşmeli
                    value={formData.incomingAmount}
                    onChange={handleChange}
                    min="0" // Negatif değer girilmesini engelle
                    required
                  />
                </div>

                <hr />

                {/* Buton Alanı */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate("/stoklistesi")} // Stok listesi sayfanızın yolu
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading} // API isteği sürerken butonu pasif yap
                  >
                    {isLoading ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>

                {/* Hata Mesajı Alanı */}
                {/* Hata Mesajı Alanı */}
                {isError && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error && "data" in error ? (
                      <span>
                        Hata: {(error.data as { message: string }).message}{" "}
                      </span>
                    ) : (
                      <span>Beklenmeyen bir hata oluştu.</span>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StokAdd;
