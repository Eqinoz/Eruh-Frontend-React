import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Badge, Card } from "react-bootstrap";
import { useGetCustomerAccountQuery } from "../services/customerService";
import { formatDate, formatNumber } from "../utilities/formatters";
import { useState } from "react";
import "./css/RawMaterialList.css"; // Tema stilleri

function CustomerAccountPage() {
  const navigate = useNavigate();
  // URL'den ID'yi al
  const { id } = useParams<{ id: string }>();
  // ID undefined ise '0' veya boş string göndererek hatayı önle
  const customerId = id ?? "";

  // Query hook'u. Eğer customerId boşsa sorgu atmasını skip edebiliriz (opsiyonel)
  const {
    data: accountResponse,
    isLoading,
    isError,
  } = useGetCustomerAccountQuery(customerId, {
    skip: !customerId, // ID yoksa sorgu atma
  });

  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  // 🛡️ KRİTİK KONTROL: Veri geldi mi ve 'data' alanı dolu mu?
  // TypeScript burada 'accountResponse.data'nın bir Obje mi yoksa Array mi olduğunu servis tanımından anlar.
  if (isError || !accountResponse || !accountResponse.data) {
    return (
      <div className="container mt-5 text-center text-danger">
        <h4>
          <i className="bi bi-exclamation-triangle me-2"></i>Müşteri bilgileri
          bulunamadı!
        </h4>
        <p className="text-muted">Geçersiz müşteri ID'si veya sunucu hatası.</p>
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate(-1)}
        >
          Geri Dön
        </button>
      </div>
    );
  }

  // ✅ Artık eminiz, data var ve tek bir obje.
  const customerData = accountResponse.data;
  // orderDetail boş gelebilir, garantiye alalım.
  const orders = customerData.orderDetail || [];

  // Basit İstatistikler
  const totalOrderCount = orders.length;
  const totalVolume = orders.reduce(
    (sum, order) => sum + order.lines.taxTotalPrice,
    0
  );

  return (
    <>
      {/* --- ÜST BİLGİ KARTI (MÜŞTERİ PROFİLİ) --- */}
      <Card className="shadow-lg border-0 mb-4">
        <Card.Body className="p-4 bg-white rounded-3">
          <div className="row">
            {/* Sol: Müşteri Künyesi */}
            <div className="col-md-7 border-end">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-fistik-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                  style={{ width: 60, height: 60 }}
                >
                  <i className="bi bi-building fs-3"></i>
                </div>
                <div>
                  {/* 👉 Hata veren yer burasıydı, artık düzelmeli */}
                  <h4 className="fw-bold text-dark mb-0">
                    {customerData.customerName}
                  </h4>
                  <span className="badge bg-success bg-opacity-10 text-success border border-success">
                    Aktif Müşteri
                  </span>
                </div>
              </div>
              <div className="row g-2 text-muted small">
                <div className="col-md-6">
                  {/* 👉 Ve burası */}
                  <i className="bi bi-person-badge me-2"></i>
                  <strong>İlgili Kişi:</strong> {customerData.relevantPerson}
                </div>
                <div className="col-md-6">
                  <i className="bi bi-telephone me-2"></i>
                  <strong>Telefon:</strong> {customerData.contactNumber}
                </div>
                <div className="col-12 mt-2">
                  <i className="bi bi-geo-alt me-2"></i>
                  <strong>Adres:</strong> {customerData.address}
                </div>
              </div>
            </div>
            {/* Sağ: Özet İstatistikler */}
            <div className="col-md-5 ps-4 d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-around text-center">
                <div>
                  <h6 className="text-muted text-uppercase ls-1 mb-2">
                    Toplam Sipariş
                  </h6>
                  <h2 className="fw-bold text-primary">
                    {totalOrderCount}{" "}
                    <small className="fs-6 text-muted">Adet</small>
                  </h2>
                </div>
                <div className="border-start"></div>
                <div>
                  <h6 className="text-muted text-uppercase ls-1 mb-2">
                    Toplam İşlem Hacmi
                  </h6>
                  <h2 className="fw-bold text-success">
                    {formatNumber(totalVolume)}{" "}
                    <small className="fs-6">₺</small>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* --- SİPARİŞ GEÇMİŞİ TABLOSU --- */}
      <Card className="shadow-lg border-0">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-clock-history me-2"></i>Sipariş Geçmişi
          </h5>
        </div>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="thead-fistik">
                <tr>
                  <th style={{ width: "40px" }}></th>
                  <th>Sipariş No</th>
                  <th>Tarih</th>
                  <th>Ürün</th>
                  <th className="text-end">Tutar</th>
                  <th className="text-center">Durum</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-5 text-muted font-italic"
                    >
                      Bu müşteriye ait sipariş kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => {
                    const line = order.lines;
                    // Durum Belirleme
                    let statusBadge;
                    if (order.isPayment) {
                      statusBadge = (
                        <Badge bg="success">
                          <i className="bi bi-check-all me-1"></i>Tamamlandı
                        </Badge>
                      );
                    } else if (order.shippedDate) {
                      statusBadge = (
                        <Badge bg="warning" text="dark">
                          <i className="bi bi-truck me-1"></i>Yolda/Bekliyor
                        </Badge>
                      );
                    } else {
                      statusBadge = (
                        <Badge bg="secondary">
                          <i className="bi bi-hourglass me-1"></i>Hazırlanıyor
                        </Badge>
                      );
                    }

                    return (
                      <>
                        {/* Ana Satır */}
                        <tr
                          key={order.id}
                          onClick={() => toggleRow(index)}
                          style={{ cursor: "pointer" }}
                          className={
                            expandedRowIndex === index
                              ? "table-active border-start border-4 border-fistik"
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
                          <td className="fw-bold">#{order.id}</td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td className="fw-semibold text-dark">
                            {line.productName}
                          </td>
                          <td className="text-end fw-bold text-success">
                            {formatNumber(line.taxTotalPrice)} ₺
                          </td>
                          <td className="text-center">{statusBadge}</td>
                        </tr>

                        {/* Detay (Accordion) */}
                        {expandedRowIndex === index && (
                          <tr>
                            <td colSpan={6} className="p-0 border-0">
                              <div className="p-4 bg-light border-bottom shadow-inner">
                                <div className="row g-3">
                                  {/* Sol: Ürün Detayları */}
                                  <div className="col-md-6 border-end">
                                    <h6 className="text-fistik fw-bold border-bottom pb-2 mb-3">
                                      <i className="bi bi-basket me-2"></i>
                                      Sipariş Detayı
                                    </h6>
                                    <ul className="list-unstyled small mb-0">
                                      <li className="mb-2">
                                        <strong>Miktar:</strong> {line.amount}{" "}
                                        Birim
                                      </li>
                                      <li className="mb-2">
                                        <strong>Birim Fiyat:</strong>{" "}
                                        {formatNumber(line.unitPrice)} ₺
                                      </li>
                                      <li className="mb-2">
                                        <strong>KDV (%{line.taxRate}):</strong>{" "}
                                        {formatNumber(line.taxAmount)} ₺
                                      </li>
                                      <li className="mb-0 pt-2 border-top">
                                        <strong>Satır Toplamı:</strong>{" "}
                                        {formatNumber(line.taxTotalPrice)} ₺
                                      </li>
                                    </ul>
                                  </div>
                                  {/* Sağ: Finansal Bilgiler */}
                                  <div className="col-md-6 ps-4">
                                    <h6 className="text-primary fw-bold border-bottom pb-2 mb-3">
                                      <i className="bi bi-currency-exchange me-2"></i>
                                      Finansal Bilgiler
                                    </h6>
                                    <ul className="list-unstyled small mb-0">
                                      <li className="mb-2">
                                        <strong>Vade:</strong>{" "}
                                        {line.maturityDay} Gün (
                                        <span className="text-danger">
                                          {formatDate(line.maturityDate)}
                                        </span>
                                        )
                                      </li>
                                      <li className="mb-2">
                                        <strong>Kur (USD):</strong>{" "}
                                        {formatNumber(line.dolarRate)} ₺
                                      </li>
                                      <li className="mb-0">
                                        <strong>Kur (EUR):</strong>{" "}
                                        {formatNumber(line.euroRate)} ₺
                                      </li>
                                    </ul>
                                    {order.shippedDate && (
                                      <div className="mt-3 small text-muted">
                                        <i className="bi bi-truck me-1"></i>
                                        Teslim Tarihi:{" "}
                                        {formatDate(order.shippedDate)}
                                      </div>
                                    )}
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
        </Card.Body>
      </Card>

      <div className="mt-3 mb-5">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/customer-list")}
        >
          <i className="bi bi-arrow-left me-2"></i>Müşteri Listesine Dön
        </button>
      </div>
    </>
  );
}

export default CustomerAccountPage;
