import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useGetCustomersQuery } from "../services/customerService";
import { useGetProductsQuery } from "../services/productService";
//import { useAddOrderMutation } from "../services/orderService";
import { type OrderModel } from "../models/orderModel";
import { type CustomerModel } from "../models/customerModel";
import { type ProductModel } from "../models/productModel";
import { formatNumber } from "../utilities/formatters";

import "./css/Forms.css";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function OrderAddPage() {
  const { data: customersData, isLoading: isLoadingCustomers } =
    useGetCustomersQuery();
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery();
  //const [addOrder, { isLoading: isAddingOrder }] = useAddOrderMutation();

  const navigate = useNavigate();

  // 🐞 1. GÜNCELLEME: 'productId' artık 'string' (boş string)
  const initialState = {
    id: 0,
    customerId: 0,
    productId: "", // 👈 String olarak değiştirildi
    quantity: 1,
    salePrice: 0,
  };
  const [order, setOrder] = useState<any>(initialState);

  // 🎨 2. 'handleChange' (Müşteri, Miktar, Satış Fiyatı için)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrder((prev: any) => ({
      ...prev,
      // 'productId' hariç (çünkü o handleProductChange'de),
      // diğerlerini sayıya çevirmeye çalış
      [name]:
        name === "quantity" || name === "salePrice" || name === "customerId"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // 🐞 3. GÜNCELLEME: 'handleProductChange' (Ürün seçimi)
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value; // 👈 'parseInt' kaldırıldı, artık string

    // ⭐️ Fiyatı artık otomatik doldurmuyoruz!
    setOrder((prev: any) => ({
      ...prev,
      productId: selectedId,
      // 'salePrice'a DOKUNMUYORUZ. Kullanıcının girmesini bekliyoruz.
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 🐞 4. GÜNCELLEME: Validasyon (doğrulama) güncellendi
    if (
      order.customerId === 0 ||
      order.productId === "" || // 👈 String kontrolü
      order.quantity <= 0 ||
      order.salePrice <= 0 // 👈 Fiyatın girilmiş olması şartı eklendi
    ) {
      toast.warn(
        "Lütfen Müşteri, Ürün, geçerli Miktar ve geçerli Fiyat girin."
      );
      return;
    }

    try {
      // await addOrder(order).unwrap();
      toast.success("Sipariş başarıyla oluşturuldu!");
      setOrder(initialState);
      navigate("/order-list");
    } catch (err: any) {
      toast.error(err.data?.message || "Sipariş oluşturulamadı.");
    }
  };

  if (isLoadingCustomers || isLoadingProducts) {
    return <div className="text-center mt-5">Veriler Yükleniyor...</div>;
  }

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-header card-header-fistik text-white">
              <h5 className="mb-0">
                <i className="bi bi-cart-plus-fill me-2"></i>Yeni Sipariş Ekle
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="customerId" className="form-label fw-bold">
                      Müşteri Seç
                    </label>
                    <select
                      id="customerId"
                      name="customerId"
                      className="form-select"
                      value={order.customerId}
                      onChange={handleChange}
                      required
                      autoFocus
                    >
                      <option value="0">-- Müşteri Seçiniz --</option>
                      {customersData?.data.map((c: CustomerModel) => (
                        <option key={c.id} value={c.id}>
                          {c.customerName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="productId" className="form-label fw-bold">
                      Ürün Seç (Satışa Hazır)
                    </label>
                    <select
                      id="productId"
                      name="productId"
                      className="form-select"
                      value={order.productId}
                      onChange={handleProductChange} // 👈 Özel fonksiyon
                      required
                    >
                      {/* 🐞 5. GÜNCELLEME: 'value' "0" değil "" (boş string) oldu */}
                      <option value="">-- Ürün Seçiniz --</option>
                      {productsData?.data.map((p: ProductModel) => (
                        // 🐞 6. GÜNCELLEME: 'p.id' yerine 'p.productId' (string)
                        <option key={p.productId} value={p.productId}>
                          {p.name} (Stok: {formatNumber(p.amount)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="salePrice" className="form-label fw-bold">
                      Satış Fiyatı (₺)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="salePrice"
                      name="salePrice"
                      value={order.salePrice}
                      onChange={handleChange} // 👈 Tamamen manuel giriş
                      placeholder="Fiyatı Elle Giriniz" // 👈 Placeholder eklendi
                      min="0.01" // 0'dan büyük olmalı
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="quantity" className="form-label fw-bold">
                      Miktar (kg/Adet)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
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
                    className="form-control fw-bold fs-5 text-success"
                    value={`${formatNumber(
                      order.salePrice * order.quantity
                    )} ₺`}
                    disabled
                  />
                </div>

                <hr />
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-fistik-secondary me-md-2"
                    onClick={() => navigate("/order-list")}
                  >
                    İptal
                  </button>
                  {/* <button
                    type="submit"
                    className="btn btn-fistik-primary"
                    disabled={isAddingOrder}
                  >
                    <i className="bi bi-cart-check me-2"></i>
                    {isAddingOrder
                      ? "Sipariş Kaydediliyor..."
                      : "Siparişi Kaydet"}
                  </button> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderAddPage;
