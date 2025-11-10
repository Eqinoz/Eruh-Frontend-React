import { useState } from "react";
import { useAddProductMutation } from "../services/productService";
import { type ProductModel } from "../models/productModel";

function ProductAddPage() {
  const [product, setProduct] = useState<ProductModel>({
    productId: "",
    name: "",
    amount: 0,
    packagingType: "",
  });

  const [addProduct, { isLoading }] = useAddProductMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(product).unwrap();
      alert("Ürün başarıyla eklendi!");
      setProduct({
        productId: "",
        name: "",
        amount: 0,
        packagingType: "",
      });
    } catch {
      alert("Ürün eklenirken bir hata oluştu!");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Ürün Ekle</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Ürün Cinsi</label>
              <input
                type="text"
                className="form-control"
                name="productId"
                value={product.productId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Ürün Adı</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Miktar</label>
              <input
                type="number"
                className="form-control"
                name="amount"
                value={product.amount}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Paketleme Türü</label>
              <input
                type="text"
                className="form-control"
                name="packagingType"
                value={product.packagingType}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={isLoading}
            >
              {isLoading ? "Ekleniyor..." : "Ürünü Kaydet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductAddPage;
