import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";

import { useGetCustomersQuery } from "../services/customerService";
import { useGetProductsQuery } from "../services/productService";
import { useAddOrderMutation } from "../services/orderService";
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
  const [addOrder, { isLoading: isAddingOrder }] = useAddOrderMutation();

  const navigate = useNavigate();

  //  React-Select için FISTIK TEMASI Ayarları
  const fistikSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? "#6B8E23" : "#ced4da", // Odaklanınca Fıstık Yeşili
      boxShadow: state.isFocused
        ? "0 0 0 0.25rem rgba(107, 142, 35, 0.25)"
        : null,
      "&:hover": { borderColor: "#6B8E23" },
      borderRadius: "0.375rem",
      padding: "2px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#6B8E23"
        : state.isFocused
        ? "#F8F8DC"
        : null, // Seçili Yeşil, Hover Krem
      color: state.isSelected ? "white" : "#8B4513", // Yazı rengi
      cursor: "pointer",
      ":active": {
        ...base[":active"],
        backgroundColor: "#6B8E23",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#2E8B57", // Seçilen değerin rengi (Koyu Yeşil)
      fontWeight: "600",
    }),
  };

  // State'ler
  const [rates, setRates] = useState({ USD: 0, EUR: 0 });
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  const [formData, setFormData] = useState({
    customerId: 0,
    productId: "",
    quantity: 1,
    unitPrice: 0,
  });

  const [dueDays, setDueDays] = useState<number>(0);
  const [calculatedMaturityDate, setCalculatedMaturityDate] = useState<Date>(
    new Date()
  );
  const [includeTax, setIncludeTax] = useState<boolean>(true);

  // --- USE EFFECTS ---
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
        setRates({ USD: 34.5, EUR: 36.8 });
        setIsLoadingRates(false);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + dueDays);
    setCalculatedMaturityDate(futureDate);
  }, [dueDays]);

  // --- VERİ HAZIRLIĞI (Select için options formatına çevirme) ---
  const customerOptions =
    customersData?.data.map((c: CustomerModel) => ({
      value: c.id,
      label: c.customerName,
    })) || [];

  const productOptions =
    productsData?.data.map((p: ProductModel) => ({
      value: p.productId,
      label: `${p.name} (Stok: ${formatNumber(p.amount)})`,
      originalData: p, // Ürün detaylarına erişmek için saklıyoruz
    })) || [];

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // 🎨 3. React-Select için Özel Handler'lar
  const handleCustomerSelect = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      customerId: selectedOption ? selectedOption.value : 0,
    }));
  };

  const handleProductSelect = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      productId: selectedOption ? selectedOption.value : "",
    }));
  };

  // --- HESAPLAMALAR ---
  const subTotal = formData.unitPrice * formData.quantity;
  const currentTaxRate = includeTax ? 1 : 0;
  const taxAmount = subTotal * (currentTaxRate / 100);
  const grandTotalTL = subTotal + taxAmount;

  const grandTotalUSD = rates.USD > 0 ? grandTotalTL / rates.USD : 0;
  const grandTotalEUR = rates.EUR > 0 ? grandTotalTL / rates.EUR : 0;

  const todayStr = new Date().toLocaleDateString("tr-TR");
  const dueDateStr = calculatedMaturityDate.toLocaleDateString("tr-TR");

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.customerId === 0 ||
      formData.productId === "" ||
      formData.quantity <= 0 ||
      formData.unitPrice <= 0
    ) {
      toast.warn("Lütfen tüm alanları eksiksiz doldurun.");
      return;
    }

    const orderPayload: any = {
      customerId: formData.customerId,
      employeeId: 1,
      orderDate: new Date(),
      lines: [
        {
          productId: formData.productId,
          unitPrice: formData.unitPrice,
          amount: formData.quantity,
          taxRate: currentTaxRate,
          taxAmount: taxAmount,
          totalPrice: subTotal,
          taxTotalPrice: grandTotalTL,
          maturityDay: dueDays,
          maturityDate: calculatedMaturityDate,
          dolarRate: rates.USD,
          euroRate: rates.EUR,
        },
      ],
    };

    try {
      await addOrder(orderPayload).unwrap();
      toast.success("Sipariş başarıyla oluşturuldu!");
      setFormData({ customerId: 0, productId: "", quantity: 1, unitPrice: 0 });
      setDueDays(0);
      setIncludeTax(true);
      navigate("/order-list");
    } catch (err: any) {
      toast.error(err.data?.message || "Sipariş oluşturulamadı.");
    }
  };

  if (isLoadingCustomers || isLoadingProducts || isLoadingRates) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-success" role="status"></div>
        <span className="ms-2 fw-bold text-success">
          Veriler Hazırlanıyor...
        </span>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
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
                <h6 className="text-muted mb-3 fw-bold border-bottom pb-2">
                  Sipariş Detayları
                </h6>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Müşteri Seç</label>
                    {/* 🚀 4. React-Select Kullanımı */}
                    <Select
                      options={customerOptions}
                      onChange={handleCustomerSelect}
                      value={customerOptions.find(
                        (c) => c.value === formData.customerId
                      )}
                      placeholder="Müşteri Ara veya Seç..."
                      noOptionsMessage={() => "Müşteri bulunamadı"}
                      styles={fistikSelectStyles} // Özel Tema
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Ürün Seç</label>
                    {/* 🚀 4. React-Select Kullanımı */}
                    <Select
                      options={productOptions}
                      onChange={handleProductSelect}
                      value={productOptions.find(
                        (p) => p.value === formData.productId
                      )}
                      placeholder="Ürün Ara veya Seç..."
                      noOptionsMessage={() => "Ürün bulunamadı"}
                      styles={fistikSelectStyles} // Özel Tema
                      required
                    />
                  </div>
                </div>

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
                      onChange={handleChange}
                      placeholder="00"
                      min="1"
                      required
                    />
                  </div>
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

                {/* --- KARTLAR (AYNI KALDI) --- */}
                <h6 className="text-muted mb-3 fw-bold border-bottom pb-2 mt-5">
                  Hesaplama Tercihi
                </h6>

                <div className="row mb-4 g-3">
                  <div className="col-md-6">
                    <div
                      className={`card h-100 cursor-pointer transition-all ${
                        includeTax
                          ? "border-success bg-success bg-opacity-10 shadow"
                          : "border-secondary bg-light opacity-50"
                      }`}
                      onClick={() => setIncludeTax(true)}
                    >
                      <div className="card-body text-center position-relative">
                        {includeTax && (
                          <i className="bi bi-check-circle-fill position-absolute top-0 end-0 m-2 text-success fs-4"></i>
                        )}
                        <h6
                          className={
                            includeTax ? "text-success fw-bold" : "text-muted"
                          }
                        >
                          KDV DAHİL (%1)
                        </h6>
                        <h3
                          className={`mt-3 mb-0 ${
                            includeTax ? "text-success fw-bold" : "text-muted"
                          }`}
                        >
                          {formatNumber(subTotal + subTotal * 0.01)} ₺
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className={`card h-100 cursor-pointer transition-all ${
                        !includeTax
                          ? "border-primary bg-primary bg-opacity-10 shadow"
                          : "border-secondary bg-light opacity-50"
                      }`}
                      onClick={() => setIncludeTax(false)}
                    >
                      <div className="card-body text-center position-relative">
                        {!includeTax && (
                          <i className="bi bi-check-circle-fill position-absolute top-0 end-0 m-2 text-primary fs-4"></i>
                        )}
                        <h6
                          className={
                            !includeTax ? "text-primary fw-bold" : "text-muted"
                          }
                        >
                          KDV HARİÇ (MUAF)
                        </h6>
                        <h3
                          className={`mt-3 mb-0 ${
                            !includeTax ? "text-primary fw-bold" : "text-muted"
                          }`}
                        >
                          {formatNumber(subTotal)} ₺
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-light border text-center">
                  <span className="text-muted me-2">SEÇİLEN GENEL TOPLAM:</span>
                  <span className="fw-bold fs-5 me-4">
                    {formatNumber(grandTotalTL)} ₺
                  </span>
                  <span className="text-muted">|</span>
                  <span className="text-primary ms-4 fw-bold">
                    {formatNumber(grandTotalUSD)} $
                  </span>
                  <span
                    className="text-warning ms-4 fw-bold"
                    style={{ color: "#fd7e14" }}
                  >
                    {formatNumber(grandTotalEUR)} €
                  </span>
                </div>

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
