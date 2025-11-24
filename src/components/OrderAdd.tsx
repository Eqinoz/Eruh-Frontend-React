import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useGetCustomersQuery } from "../services/customerService";
import { useGetProductsQuery } from "../services/productService";
import { useAddOrderMutation } from "../services/orderService"; // 👈 Servisini açtım
import { type CustomerModel } from "../models/customerModel";
import { type ProductModel } from "../models/productModel";
import { formatNumber } from "../utilities/formatters";

// Token'dan personel ID'si almak için (Varsa helper'ını kullan)
// import { getEmployeeIdFromToken } from "../utilities/tokenHelper";

import "./css/Forms.css";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function OrderAddPage() {
  // --- API HOOKS ---
  const { data: customersData, isLoading: isLoadingCustomers } =
    useGetCustomersQuery();
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery();
  const [addOrder, { isLoading: isAddingOrder }] = useAddOrderMutation();

  const navigate = useNavigate();

  // --- STATE'LER ---
  // 💰 Döviz Kurları
  const [rates, setRates] = useState({ USD: 0, EUR: 0 });
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  // 📝 Form Verileri (UI için düz tutuyoruz, gönderirken modele çevireceğiz)
  const [formData, setFormData] = useState({
    customerId: 0,
    productId: "",
    quantity: 1,
    unitPrice: 0, // salePrice yerine modeldeki ismi kullandım
  });

  // 📅 Vade Gün Sayısı
  const [dueDays, setDueDays] = useState<number>(0);
  // 📅 Hesaplanan Vade Tarihi
  const [calculatedMaturityDate, setCalculatedMaturityDate] = useState<Date>(
    new Date()
  );

  // --- USE EFFECTS ---

  // 1. Canlı Döviz Çekme
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        const dollarRate = data.rates.TRY;
        const euroRate = dollarRate / data.rates.EUR;

        setRates({ USD: dollarRate, EUR: euroRate });
        setIsLoadingRates(false);
      } catch (error) {
        console.error("Döviz çekilemedi:", error);
        toast.warn("Döviz kurları alınamadı, varsayılanlar kullanılıyor.");
        setRates({ USD: 34.5, EUR: 36.8 }); // Fallback
        setIsLoadingRates(false);
      }
    };
    fetchRates();
  }, []);

  // 2. Vade Tarihi Hesaplama (Gün değişince)
  useEffect(() => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + dueDays);
    setCalculatedMaturityDate(futureDate);
  }, [dueDays]);

  // --- HANDLERS ---

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "productId" ? value : parseFloat(value) || 0,
    }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    // Ürün değişince fiyatı sıfırla veya API'den gelen fiyatı koy (Manuel istediğin için ellemiyorum)
    setFormData((prev) => ({ ...prev, productId: selectedId }));
  };

  // 🚀 ASIL OLAY BURADA: Backend Modeline Dönüştürme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasyon
    if (
      formData.customerId === 0 ||
      formData.productId === "" ||
      formData.quantity <= 0 ||
      formData.unitPrice <= 0
    ) {
      toast.warn("Lütfen tüm alanları eksiksiz doldurun.");
      return;
    }

    // --- HESAPLAMALAR ---
    const TAX_RATE = 1; // %1 KDV
    const totalPrice = formData.unitPrice * formData.quantity; // KDV'siz Toplam
    const taxAmount = totalPrice * (TAX_RATE / 100); // KDV Tutarı
    const taxTotalPrice = totalPrice + taxAmount; // Genel Toplam

    // --- PAYLOAD OLUŞTURMA (Senin Modelin) ---
    // Typescript uyarısı almamak için 'any' kullandım ama normalde OrderModel interface'ini kullanmalısın
    const orderPayload: any = {
      customerId: formData.customerId,
      employeeId: 1, // ⚠️ TODO: Burayı token'dan gelen ID ile değiştir! (getEmployeeIdFromToken())
      orderDate: new Date(), // Şu an
      lines: [
        {
          productId: formData.productId,
          unitPrice: formData.unitPrice,
          amount: formData.quantity,

          // Hesaplanan Değerler
          taxRate: TAX_RATE,
          taxAmount: taxAmount,
          totalPrice: totalPrice, // KDV'siz ara toplam
          taxTotalPrice: taxTotalPrice, // KDV'li genel toplam

          // Vade Bilgileri
          maturityDay: dueDays,
          maturityDate: calculatedMaturityDate,

          // Kur Bilgileri (O anki kur sabitlenir)
          dolarRate: rates.USD,
          euroRate: rates.EUR,
        },
      ],
    };

    try {
      console.log("Backend'e Giden Data:", orderPayload); // Kontrol için
      await addOrder(orderPayload).unwrap();

      toast.success("Sipariş ve detayları başarıyla kaydedildi!");

      // Formu Sıfırla
      setFormData({ customerId: 0, productId: "", quantity: 1, unitPrice: 0 });
      setDueDays(0);
      navigate("/order-list");
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Sipariş oluşturulamadı.");
    }
  };

  // --- RENDER ---

  if (isLoadingCustomers || isLoadingProducts || isLoadingRates) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <span className="ms-2 fw-bold text-success">
          Veriler Hazırlanıyor...
        </span>
      </div>
    );
  }

  // UI Hesaplamaları (Görüntüleme için)
  const uiSubTotal = formData.unitPrice * formData.quantity;
  const uiKdv = uiSubTotal * 0.01;
  const uiGrandTotal = uiSubTotal + uiKdv;

  const grandTotalUSD = rates.USD > 0 ? uiGrandTotal / rates.USD : 0;
  const grandTotalEUR = rates.EUR > 0 ? uiGrandTotal / rates.EUR : 0;

  const todayStr = new Date().toLocaleDateString("tr-TR");
  const dueDateStr = calculatedMaturityDate.toLocaleDateString("tr-TR");

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            {/* Header & Kurlar */}
            <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-cart-plus-fill me-2"></i>Yeni Satış Ekranı
              </h5>
              <div className="badge bg-light text-dark border">
                <span className="text-success me-2">
                  $1 = {formatNumber(rates.USD)} ₺
                </span>
                <span className="text-warning" style={{ color: "#fd7e14" }}>
                  €1 = {formatNumber(rates.EUR)} ₺
                </span>
              </div>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* --- ÜRÜN & MÜŞTERİ --- */}
                <h6 className="text-muted mb-3 fw-bold border-bottom pb-2">
                  Sipariş Detayları
                </h6>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Müşteri Seç</label>
                    <select
                      name="customerId"
                      className="form-select"
                      value={formData.customerId}
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
                    <label className="form-label fw-bold">Ürün Seç</label>
                    <select
                      name="productId"
                      className="form-select"
                      value={formData.productId}
                      onChange={handleProductChange}
                      required
                    >
                      <option value="">-- Ürün Seçiniz --</option>
                      {productsData?.data.map((p: ProductModel) => (
                        <option key={p.productId} value={p.productId}>
                          {p.name} (Stok: {formatNumber(p.amount)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* --- FİYAT & MİKTAR & VADE --- */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <label className="form-label fw-bold">
                      Birim Fiyat (₺)
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        required
                      />
                      <span className="input-group-text bg-light">₺</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Miktar</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>

                  {/* VADE ALANI */}
                  <div className="col-md-2">
                    <label className="form-label fw-bold text-muted small">
                      İşlem Tarihi
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={todayStr}
                      disabled
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold text-primary">
                      Vade (Gün)
                    </label>
                    <input
                      type="number"
                      className="form-control border-primary"
                      value={dueDays}
                      onChange={(e) => setDueDays(Number(e.target.value))}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold text-danger">
                      Vade Tarihi
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light text-danger fw-bold"
                      value={dueDateStr}
                      disabled
                    />
                  </div>
                </div>

                {/* --- ÖZET KARTLARI --- */}
                <h6 className="text-muted mb-3 fw-bold border-bottom pb-2 mt-5">
                  Ödeme Özeti
                </h6>
                <div className="row mb-4 g-3">
                  <div className="col-md-4">
                    <div className="card bg-light border-success h-100">
                      <div className="card-body text-center">
                        <h6 className="card-title text-success">
                          Toplam Tutar (TL)
                        </h6>
                        <p className="card-text fs-3 fw-bold text-dark mb-0">
                          {formatNumber(uiGrandTotal)} ₺
                        </p>
                        <small className="text-muted">KDV Dahil</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light border-primary h-100">
                      <div className="card-body text-center">
                        <h6 className="card-title text-primary">
                          Dolar Karşılığı ($)
                        </h6>
                        <p className="card-text fs-3 fw-bold text-dark mb-0">
                          {formatNumber(grandTotalUSD)} $
                        </p>
                        <small className="text-muted">
                          Kur: {formatNumber(rates.USD)}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light border-warning h-100">
                      <div className="card-body text-center">
                        <h6
                          className="card-title text-warning"
                          style={{ color: "#fd7e14" }}
                        >
                          Euro Karşılığı (€)
                        </h6>
                        <p className="card-text fs-3 fw-bold text-dark mb-0">
                          {formatNumber(grandTotalEUR)} €
                        </p>
                        <small className="text-muted">
                          Kur: {formatNumber(rates.EUR)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- BUTONLAR --- */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button
                    type="button"
                    className="btn btn-fistik-secondary me-md-2 px-4 py-2"
                    onClick={() => navigate("/order-list")}
                  >
                    <i className="bi bi-x-lg me-2"></i>İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-fistik-primary px-4 py-2"
                    disabled={isAddingOrder}
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    {isAddingOrder
                      ? "Kaydediliyor..."
                      : "Siparişi Onayla ve Kaydet"}
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

export default OrderAddPage;
