import React, { useState } from "react";
import { useAddProductMutation } from "../services/productService";
import { type ProductModel } from "../models/productModel";
import { useNavigate } from "react-router-dom"; // 🎨 1. Yönlendirme için eklendi
import { toast } from "react-toastify"; // 🎨 2. Toastify için eklendi

// 🎨 3. Gerekli tüm temaları import ettim
import "./css/Forms.css";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function ProductAddPage() {
  // 🐞 4. Eksik olan 'description' alanını state'e ekledim
  const initialState: ProductModel = {
    id: 0,
    productId: "",
    name: "",
    amount: 0,
    packagingType: "",
  };

  const [product, setProduct] = useState<ProductModel>(initialState);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate(); // 🎨 Yönlendirmeyi tanımla

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      // 🐞 5. 'amount' alanını sayı olarak kaydetmek için düzeltme
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(product).unwrap();

      // 🎨 6. 'alert' yerine 'toast.success' ve yönlendirme
      toast.success(`"${product.name}" başarıyla eklendi!`);
      setProduct(initialState); // Formu sıfırla
      navigate("/product-list"); // Liste sayfasına yönlendir (Sidebar'daki yol)
    } catch (err: any) {
      // 🎨 7. 'alert' yerine 'toast.error'
      console.error("Ürün eklenemedi:", err);
      toast.error(err.data?.message || "Ürün eklenirken bir hata oluştu!");
    }
  };

  return (
    // 🎨 8. Layout'u standart temaya uygun hale getirdim
    <div className="container-fluid px-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            {/* 🎨 9. Kart başlığını temaya uygun hale getirdim */}
            <div className="card-header card-header-fistik text-white">
              <h5 className="mb-0">
                <i className="bi bi-bag-plus-fill me-2"></i>Yeni Ürün Ekle
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  {/* 🎨 10. Label'ları 'fw-bold' yaptım ve 'htmlFor/id' ekledim */}
                  <label htmlFor="productId" className="form-label fw-bold">
                    Ürün Kodu (SKU)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productId"
                    name="productId"
                    value={product.productId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* 🐞 11. Eksik olan 'Açıklama' alanını ekledim */}

                <div className="mb-3">
                  <label htmlFor="amount" className="form-label fw-bold">
                    Miktar (kg)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    name="amount"
                    placeholder="0"
                    onChange={handleChange}
                    required
                    step="1"
                    min="0" // Negatif girişi engelle
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="packagingType" className="form-label fw-bold">
                    Paketleme Türü
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="packagingType"
                    name="packagingType"
                    value={product.packagingType}
                    onChange={handleChange}
                    required
                  />
                </div>

                <hr />
                {/* 🎨 12. Butonları temaya uygun hale getirdim */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-fistik-secondary me-md-2"
                    onClick={() => navigate("/product-list")}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-fistik-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ekleniyor..." : "Ürünü Kaydet"}
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

export default ProductAddPage;
