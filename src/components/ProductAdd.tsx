import React, { useState } from "react";
import { useAddProductMutation } from "../services/productService";
import { useGetPackagingTypesQuery } from "../services/packagingTypeService";
import { type ProductModel } from "../models/productModel";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./css/Forms.css";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function generateProductType(code: string): string {
  if (!code) return "";
  
  const upperCode = code.toUpperCase();
  const result: string[] = [];
  let i = 0;
  
  while (i < upperCode.length) {
    // İki karakterli kombinasyonları önce kontrol et
    if (i < upperCode.length - 1) {
      const twoChar = upperCode.substring(i, i + 2);
      switch (twoChar) {
        case "LX":
          result.push("LÜKS");
          i += 2;
          continue;
        case "NT":
          result.push("NATUREL");
          i += 2;
          continue;
        case "LK":
          result.push("LEKELİ");
          i += 2;
          continue;
        case "AÇ":
          result.push("ANA ÇITLAK");
          i += 2;
          continue;
      }
    }
    
    // Tek karakterli eşleşmeleri kontrol et
    const char = upperCode[i];
    switch (char) {
      case "D":
        result.push("DUBLE");
        break;
      case "B":
        result.push("BEYAZ");
        break;
      case "K":
        result.push("KIRMIZI");
        break;
      case "İ":
      case "I":
        result.push("İTHAL");
        break;
      case "Ö":
      case "O":
        result.push("ÖZEL");
        break;
      case "Z":
        result.push("ZAYIF");
        break;
      case " ":
        // Boşluk karakterini atla
        break;
      default:
        // Bilinmeyen karakter varsa olduğu gibi ekle
        result.push(char);
    }
    i++;
  }
  
  return result.join(" ");
}

function ProductAddPage() {
  const initialState: ProductModel = {
    id: 0,
    productId: "",
    name: "",
    amount: 0,
    packagingType: "",
  };

  const [product, setProduct] = useState<ProductModel>(initialState);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const { data: packagingTypes } = useGetPackagingTypesQuery();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    
    if (name === "productId") {
      processedValue = value.toLocaleUpperCase("tr-TR");
      // productId değiştiğinde name'i otomatik doldur
      const generatedName = generateProductType(processedValue as string);
      setProduct((prevState) => ({
        ...prevState,
        productId: processedValue as string,
        name: generatedName,
      }));
      return;
    } else if (name === "name") {
      processedValue = value.toLocaleUpperCase("tr-TR");
    } else if (name === "amount") {
      processedValue = parseInt(value, 10) || 0;
    }
    
    setProduct((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(product).unwrap();
      toast.success(`"${product.name}" başarıyla eklendi!`);
      setProduct(initialState);
      navigate("/product-list");
    } catch (err: any) {
      console.error("Ürün eklenemedi:", err);
      toast.error(err.data?.message || "Ürün eklenirken bir hata oluştu!");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm">
          <div className="card-header card-header-fistik text-white">
            <h5 className="mb-0">
              <i className="bi bi-bag-plus-fill me-2"></i>Yeni Ürün Ekle
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
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
                  placeholder="Örn: DLXB, KB, İK"
                  required
                  autoFocus
                />
                <small className="text-muted">Kod girildiğinde ürün adı otomatik oluşturulur</small>
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
                  min="0"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="packagingType" className="form-label fw-bold">
                  Paketleme Türü
                </label>
                <select
                  className="form-select fw-bold form-control"
                  id="packagingType"
                  name="packagingType"
                  value={product.packagingType}
                  onChange={handleChange}
                  required
                >
                  <option value="" >Seçiniz...</option>
                  {packagingTypes?.data.map((pt) => (
                    <option key={pt.id} value={pt.packagingTypeName}>
                      {pt.packagingTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <hr />
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
  );
}

export default ProductAddPage;

