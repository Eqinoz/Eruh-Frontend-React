import { useState } from "react";
import Layout from "../components/Layout";

function OrderAddPage() {
  // Demo veriler (API bağlantısı yok)
  const demoCustomers = [
    { id: 1, customerName: "Kardeşler Ltd. Şti." },
    { id: 2, customerName: "Tekno Market A.Ş." },
    { id: 3, customerName: "Yıldız Elektronik" },
  ];

  const demoProducts = [
    { id: 1, name: "Laptop", unitPrice: 25000 },
    { id: 2, name: "Mouse", unitPrice: 450 },
    { id: 3, name: "Klavye", unitPrice: 950 },
    { id: 4, name: "Monitör", unitPrice: 4800 },
  ];

  const [order, setOrder] = useState({
    customerId: 0,
    productId: 0,
    quantity: 1,
    salePrice: 0,
  });

  const [unitPrice, setUnitPrice] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const selectedProduct = demoProducts.find((p) => p.id === selectedId);
    setOrder({
      ...order,
      productId: selectedId,
      salePrice: selectedProduct?.unitPrice || 0,
    });
    setUnitPrice(selectedProduct?.unitPrice || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`
📦 Sipariş Oluşturuldu (DEMO)
------------------------------
Müşteri: ${
      demoCustomers.find((c) => c.id === Number(order.customerId))?.customerName
    }
Ürün: ${demoProducts.find((p) => p.id === Number(order.productId))?.name}
Miktar: ${order.quantity}
Satış Fiyatı: ${order.salePrice} ₺
Toplam: ${order.quantity * order.salePrice} ₺
`);
    setOrder({
      customerId: 0,
      productId: 0,
      quantity: 1,
      salePrice: 0,
    });
    setUnitPrice(0);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">🧾 Yeni Sipariş Ekle</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Müşteri Seç</label>
                  <select
                    name="customerId"
                    className="form-select"
                    value={order.customerId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Seçiniz --</option>
                    {demoCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.customerName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Ürün Seç</label>
                  <select
                    name="productId"
                    className="form-select"
                    value={order.productId}
                    onChange={handleProductChange}
                    required
                  >
                    <option value="">-- Seçiniz --</option>
                    {demoProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Satış Fiyatı</label>
                  <input
                    type="number"
                    className="form-control"
                    name="salePrice"
                    value={order.salePrice}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Miktar</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={order.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Toplam Tutar</label>
                <input
                  type="text"
                  className="form-control fw-bold"
                  value={`${(order.salePrice * order.quantity).toFixed(2)} ₺`}
                  disabled
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                <i className="bi bi-cart-check me-2"></i> Siparişi Kaydet (Demo)
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderAddPage;
