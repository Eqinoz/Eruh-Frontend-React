import { useState } from "react";
import { useGetDetailsOrderQuery } from "../services/orderService";
import type { OrderDtoModel } from "../models/orderDtoModel";
import { formatCurrency, formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";
import ExcelButton from "../common/ExcelButton";

function CompletedPaymentList() {
  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetDetailsOrderQuery();
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const allOrders: OrderDtoModel[] = ordersResponse?.data || [];

  //  FİLTRE: Ödemesi TAMAMLANMIŞ (isPayment = true) olanlar
  const completedPayments = allOrders.filter((o) => o.isPayment === true);

  // Kasa Toplamı
  const totalCash = completedPayments.reduce(
    (sum, o) => sum + o.lines.taxTotalPrice,
    0
  );

  //Excel İşlemleri
  const columns = [
    { header: "Sipariş No", key: "id" },
    { header: "Müşteri", key: "customerName" },
    { header: "Sipariş Tarihi", key: "orderDate" },
    { header: "Ürün", key: "productName" },
    { header: "Tutar", key: "taxTotalPrice" },
  ];

  const excelData = completedPayments.map((item) => ({
    id: item.id,
    customerName: item.customerName,
    orderDate: formatDate(item.orderDate),
    productName: item.lines.productName,
    taxTotalPrice: formatCurrency(item.lines.taxTotalPrice),
  })) ?? [];

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-lg border-0">
        {/* HEADER: KASA DURUMU */}
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-safe2-fill me-2"></i>Kasa & Geçmiş Tahsilatlar
          </h5>
          <div className="bg-white text-success px-4 py-2 rounded fw-bold shadow-sm">
            <i className="bi bi-cash-stack me-2"></i>
            Toplam Tahsilat: {formatNumber(totalCash)} ₺
          </div>
          <ExcelButton 
            data={excelData} 
            columns={columns} 
            fileName="Kasa-Durumu"
            title="Excel'e Aktar"
            disabled={isLoading} 
          />
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-success">
              <tr>
                <th style={{ width: "40px" }}></th>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Sipariş Tarihi</th>
                <th>Ürün</th>
                <th className="text-end">Tutar</th>
                <th className="text-center">Durum</th>
              </tr>
            </thead>
            <tbody>
              {completedPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                    Henüz tamamlanmış bir tahsilat kaydı yok.
                  </td>
                </tr>
              ) : (
                completedPayments.map((order, index) => {
                  const line = order.lines;
                  return (
                    <>
                      {/* --- ANA SATIR --- */}
                      <tr
                        key={order.id}
                        onClick={() => toggleRow(index)}
                        style={{ cursor: "pointer" }}
                        className={
                          expandedRowIndex === index
                            ? "bg-light border-start border-5 border-success"
                            : ""
                        }
                      >
                        <td className="text-center text-muted">
                          <i
                            className={`bi bi-chevron-${
                              expandedRowIndex === index ? "up" : "down"
                            }`}
                          ></i>
                        </td>
                        <td className="fw-bold text-muted">#{order.id}</td>
                        <td className="fw-bold text-dark">
                          {order.customerName}
                        </td>
                        <td>{formatDate(order.orderDate)}</td>
                        <td>{line.productName}</td>
                        <td className="text-end fw-bold text-success fs-5">
                          {formatNumber(line.taxTotalPrice)} ₺
                        </td>
                        <td className="text-center">
                          <span className="badge bg-success px-3 py-2 rounded-pill">
                            <i className="bi bi-check2-all me-1"></i>Tahsil
                            Edildi
                          </span>
                        </td>
                      </tr>

                      {expandedRowIndex === index && (
                        <tr>
                          <td colSpan={7} className="p-0 border-0">
                            <div className="p-4 bg-white border-bottom shadow-inner">
                              {/* 1. ZAMAN ÇİZELGESİ (Timeline) */}
                              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-4 border border-success border-opacity-25">
                                <div className="d-flex align-items-center text-muted opacity-75">
                                  <i className="bi bi-receipt fs-4 me-2"></i>
                                  <div>
                                    <small
                                      className="d-block"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      Sipariş Tarihi
                                    </small>
                                    <span className="fw-bold">
                                      {formatDate(order.orderDate)}
                                    </span>
                                  </div>
                                </div>
                                <div className="border-top border-2 flex-grow-1 mx-3 text-success opacity-25"></div>
                                <div className="d-flex align-items-center text-success opacity-75">
                                  <i className="bi bi-truck fs-4 me-2"></i>
                                  <div>
                                    <small
                                      className="d-block"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      Teslim Tarihi
                                    </small>
                                    <span className="fw-bold">
                                      {formatDate(order.shippedDate!)}
                                    </span>
                                  </div>
                                </div>
                                <div className="border-top border-2 flex-grow-1 mx-3 text-success opacity-25"></div>
                                <div className="d-flex align-items-center text-success">
                                  <i className="bi bi-patch-check-fill fs-3 me-2"></i>
                                  <div>
                                    <small
                                      className="d-block fw-bold"
                                      style={{ fontSize: "0.8rem" }}
                                    >
                                      TAHSİLAT TAMAMLANDI
                                    </small>
                                    <span className="badge bg-success">
                                      Vade: {formatDate(line.maturityDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="row g-4">
                                {/* 2. SOL KART: Ürün Detayı */}
                                <div className="col-md-4">
                                  <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-header bg-white border-bottom fw-bold text-secondary">
                                      <i className="bi bi-basket me-2"></i>Ürün
                                      Bilgileri
                                    </div>
                                    <div className="card-body">
                                      <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between">
                                          <span className="text-muted">
                                            Ürün:
                                          </span>
                                          <span className="fw-bold">
                                            {line.productName}
                                          </span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                          <span className="text-muted">
                                            Satılan Miktar:
                                          </span>
                                          <span className="fw-bold">
                                            {line.amount} Birim
                                          </span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                          <span className="text-muted">
                                            Birim Fiyat:
                                          </span>
                                          <span>
                                            {formatNumber(line.unitPrice)} ₺
                                          </span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between bg-light">
                                          <span className="text-muted">
                                            KDV Dahil Toplam:
                                          </span>
                                          <span className="fw-bold text-success">
                                            {formatNumber(line.taxTotalPrice)} ₺
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                {/* 3. ORTA KART: Geçmiş Kurlar */}
                                <div className="col-md-4">
                                  <div className="card h-100 border-0 shadow-sm bg-light bg-opacity-50">
                                    <div className="card-header bg-transparent border-bottom fw-bold text-muted">
                                      <i className="bi bi-clock-history me-2"></i>
                                      Satış Anı Kurları
                                    </div>
                                    <div className="card-body d-flex flex-column justify-content-center">
                                      <div className="d-flex align-items-center justify-content-between mb-3">
                                        <span className="text-muted">
                                          <span className="fs-5 me-2">🇺🇸</span>
                                          USD Kuru:
                                        </span>
                                        <span className="fw-bold font-monospace">
                                          {formatNumber(line.dolarRate)} ₺
                                        </span>
                                      </div>
                                      <div className="d-flex align-items-center justify-content-between">
                                        <span className="text-muted">
                                          <span className="fs-5 me-2">🇪🇺</span>
                                          EUR Kuru:
                                        </span>
                                        <span className="fw-bold font-monospace">
                                          {formatNumber(line.euroRate)} ₺
                                        </span>
                                      </div>
                                      <hr />
                                      <small className="text-center text-muted fst-italic">
                                        * Bu kurlar sipariş tarihinde
                                        kaydedilmiştir.
                                      </small>
                                    </div>
                                  </div>
                                </div>

                                {/* 4. SAĞ KART: Başarı Kartı */}
                                <div className="col-md-4">
                                  <div
                                    className="card h-100 border-success border-2 shadow-sm"
                                    style={{ backgroundColor: "#f0fff4" }}
                                  >
                                    <div className="card-body d-flex flex-column justify-content-center text-center position-relative overflow-hidden">
                                      {/* Arka plan ikonu (Süsleme) */}
                                      <i
                                        className="bi bi-check-circle position-absolute text-success opacity-10"
                                        style={{
                                          fontSize: "10rem",
                                          top: "-20px",
                                          right: "-20px",
                                        }}
                                      ></i>

                                      <h6 className="text-success text-uppercase letter-spacing-1 mb-2">
                                        Kasa Girişi
                                      </h6>
                                      <h1 className="display-6 fw-bold text-success mb-0">
                                        +{formatNumber(line.taxTotalPrice)} ₺
                                      </h1>
                                      <div className="mt-3">
                                        <span className="badge bg-success rounded-pill px-3">
                                          <i className="bi bi-lock-fill me-1"></i>
                                          İşlem Kapandı
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CompletedPaymentList;
