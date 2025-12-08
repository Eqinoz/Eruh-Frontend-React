import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Badge, Card, Table } from "react-bootstrap";
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

  // Cari hesap bilgileri
  const openingBalance = customerData.openingBalance ?? 0;
  const totalOrderAmount = customerData.totalOrderAmount ?? totalVolume;
  const totalPaymentAmount = customerData.totalPaymentAmount ?? 0;
  const currentBalance = customerData.currentBalance ?? (openingBalance + totalOrderAmount - totalPaymentAmount);
  const financialTransactions = customerData.financialTransactions ?? [];

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

      {/* --- CARİ HESAP ÖZETİ --- */}
      <Card className="shadow-lg border-0 mb-4">
        <div className="card-header card-header-fistik text-white">
          <h5 className="mb-0">
            <i className="bi bi-wallet2 me-2"></i>Cari Hesap Özeti
          </h5>
        </div>
        <Card.Body className="p-4">
          <div className="row g-3">
            {/* Açılış Bakiyesi */}
            <div className="col-md-3">
              <div className="border rounded-3 p-3 text-center h-100 bg-info bg-opacity-10">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 45, height: 45, background: 'linear-gradient(135deg, #0dcaf0 0%, #5bc0de 100%)' }}
                  >
                    <i className="bi bi-arrow-right-circle text-white"></i>
                  </div>
                </div>
                <div className="small text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Devir Bakiye</div>
                <div className="fw-bold text-info fs-4">{formatNumber(openingBalance)} <span className="small">₺</span></div>
              </div>
            </div>
            {/* Toplam Sipariş Tutarı */}
            <div className="col-md-3">
              <div className="border rounded-3 p-3 text-center h-100 bg-warning bg-opacity-10">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 45, height: 45, background: 'linear-gradient(135deg, #ffc107 0%, #ffda6a 100%)' }}
                  >
                    <i className="bi bi-cart-plus text-dark"></i>
                  </div>
                </div>
                <div className="small text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Toplam Sipariş</div>
                <div className="fw-bold text-warning fs-4">{formatNumber(totalOrderAmount)} <span className="small">₺</span></div>
              </div>
            </div>
            {/* Toplam Tahsilat */}
            <div className="col-md-3">
              <div className="border rounded-3 p-3 text-center h-100 bg-success bg-opacity-10">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 45, height: 45, background: 'linear-gradient(135deg, #198754 0%, #28a745 100%)' }}
                  >
                    <i className="bi bi-cash-coin text-white"></i>
                  </div>
                </div>
                <div className="small text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Toplam Tahsilat</div>
                <div className="fw-bold text-success fs-4">{formatNumber(totalPaymentAmount)} <span className="small">₺</span></div>
              </div>
            </div>
            {/* Güncel Bakiye */}
            <div className="col-md-3">
              <div className={`border rounded-3 p-3 text-center h-100 ${currentBalance > 0 ? 'bg-danger bg-opacity-10 border-danger' : 'bg-success bg-opacity-10 border-success'}`}>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 45, height: 45, background: currentBalance > 0 ? 'linear-gradient(135deg, #dc3545 0%, #e35d6a 100%)' : 'linear-gradient(135deg, #198754 0%, #28a745 100%)' }}
                  >
                    <i className={`bi ${currentBalance > 0 ? 'bi-exclamation-triangle' : 'bi-check-circle'} text-white`}></i>
                  </div>
                </div>
                <div className="small text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Güncel Bakiye</div>
                <div className={`fw-bold fs-4 ${currentBalance > 0 ? 'text-danger' : 'text-success'}`}>
                  {formatNumber(currentBalance)} <span className="small">₺</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* --- FİNANSAL İŞLEMLER (DEVİR BORÇLAR) --- */}
      {financialTransactions.length > 0 && (
        <Card className="shadow-lg border-0 mb-4">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-journal-text me-2"></i>Finansal İşlemler
            </h5>
            <Badge bg="light" text="dark">{financialTransactions.length} İşlem</Badge>
          </div>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tarih</th>
                    <th>Açıklama</th>
                    <th className="text-center">Tür</th>
                    <th className="text-end">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {financialTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="text-muted">{formatDate(transaction.date)}</td>
                      <td className="fw-semibold">{transaction.description}</td>
                      <td className="text-center">
                        {transaction.isDebt ? (
                          <Badge bg="danger">
                            <i className="bi bi-arrow-down-circle me-1"></i>Borç
                          </Badge>
                        ) : (
                          <Badge bg="success">
                            <i className="bi bi-arrow-up-circle me-1"></i>Ödeme
                          </Badge>
                        )}
                      </td>
                      <td className={`text-end fw-bold ${transaction.isDebt ? 'text-danger' : 'text-success'}`}>
                        {transaction.isDebt ? '+' : '-'}{formatNumber(transaction.amount)} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

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
                          <i className="bi bi-truck me-1"></i>Teslim Edildi<br/>Ödeme Bekleniyor
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

                        {/* Detay (Accordion) - Zengin Görünüm */}
                        {expandedRowIndex === index && (
                          <tr>
                            <td colSpan={6} className="p-0 border-0">
                              <div 
                                className="border-bottom"
                                style={{ 
                                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                  animation: 'slideDown 0.3s ease-out'
                                }}
                              >
                                {/* Üst Mini Kartlar - Özet Bilgiler */}
                                <div className="p-3 border-bottom" style={{ background: 'rgba(74, 124, 89, 0.05)' }}>
                                  <div className="row g-2">
                                    <div className="col-6 col-md-3">
                                      <div className="bg-white rounded-3 p-3 text-center shadow-sm h-100">
                                        <div className="d-flex align-items-center justify-content-center mb-2">
                                          <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #4a7c59 0%, #6b9b7a 100%)' }}
                                          >
                                            <i className="bi bi-box text-white"></i>
                                          </div>
                                        </div>
                                        <div className="small text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Miktar</div>
                                        <div className="fw-bold text-dark fs-5">{line.amount} <span className="small text-muted">KG</span></div>
                                      </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                      <div className="bg-white rounded-3 p-3 text-center shadow-sm h-100">
                                        <div className="d-flex align-items-center justify-content-center mb-2">
                                          <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0d6efd 0%, #4d94ff 100%)' }}
                                          >
                                            <i className="bi bi-tag text-white"></i>
                                          </div>
                                        </div>
                                        <div className="small text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Birim Fiyat</div>
                                        <div className="fw-bold text-primary fs-5">{formatNumber(line.unitPrice)} <span className="small">₺</span></div>
                                      </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                      <div className="bg-white rounded-3 p-3 text-center shadow-sm h-100">
                                        <div className="d-flex align-items-center justify-content-center mb-2">
                                          <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #ffc107 0%, #ffda6a 100%)' }}
                                          >
                                            <i className="bi bi-percent text-dark"></i>
                                          </div>
                                        </div>
                                        <div className="small text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>KDV (%{line.taxRate})</div>
                                        <div className="fw-bold text-warning fs-5">{formatNumber(line.taxAmount)} <span className="small">₺</span></div>
                                      </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                      <div className="rounded-3 p-3 text-center shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #198754 0%, #28a745 100%)' }}>
                                        <div className="d-flex align-items-center justify-content-center mb-2">
                                          <div 
                                            className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: 40, height: 40 }}
                                          >
                                            <i className="bi bi-cash-stack text-white"></i>
                                          </div>
                                        </div>
                                        <div className="small text-white text-opacity-75 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Toplam</div>
                                        <div className="fw-bold text-white fs-5">{formatNumber(line.taxTotalPrice)} <span className="small">₺</span></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Alt Detay Bölümü */}
                                <div className="p-4">
                                  <div className="row g-4">
                                    {/* Sol: Sipariş Timeline */}
                                    <div className="col-md-6">
                                      <div className="bg-white rounded-3 p-3 shadow-sm h-100">
                                        <h6 className="fw-bold mb-3 d-flex align-items-center">
                                          <span 
                                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                            style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4a7c59 0%, #6b9b7a 100%)' }}
                                          >
                                            <i className="bi bi-clock-history text-white" style={{ fontSize: '0.8rem' }}></i>
                                          </span>
                                          Sipariş Durumu
                                        </h6>
                                        
                                        {/* Timeline */}
                                        <div className="position-relative ps-4">
                                          {/* Timeline çizgisi */}
                                          <div 
                                            className="position-absolute" 
                                            style={{ 
                                              left: '11px', 
                                              top: '8px', 
                                              bottom: '8px', 
                                              width: '2px', 
                                              background: 'linear-gradient(to bottom, #198754, #ffc107, #6c757d)'
                                            }}
                                          ></div>
                                          
                                          {/* Sipariş Alındı */}
                                          <div className="d-flex align-items-start mb-3 position-relative">
                                            <div 
                                              className="position-absolute bg-success rounded-circle border border-2 border-white shadow-sm"
                                              style={{ left: '-16px', width: '14px', height: '14px', top: '4px' }}
                                            ></div>
                                            <div className="ms-2">
                                              <div className="small fw-semibold text-success">Sipariş Alındı</div>
                                              <div className="small text-muted">{formatDate(order.orderDate)}</div>
                                            </div>
                                          </div>
                                          
                                          {/* Kargoya Verildi */}
                                          <div className="d-flex align-items-start mb-3 position-relative">
                                            <div 
                                              className={`position-absolute rounded-circle border border-2 border-white shadow-sm ${order.shippedDate ? 'bg-success' : 'bg-secondary bg-opacity-50'}`}
                                              style={{ left: '-16px', width: '14px', height: '14px', top: '4px' }}
                                            ></div>
                                            <div className="ms-2">
                                              <div className={`small fw-semibold ${order.shippedDate ? 'text-success' : 'text-muted'}`}>
                                                <i className="bi bi-truck me-1"></i>Teslim Edildi
                                              </div>
                                              <div className="small text-muted">
                                                {order.shippedDate ? formatDate(order.shippedDate) : 'Bekleniyor...'}
                                              </div>
                                            </div>
                                          </div>
                                          
                                          {/* Ödeme Tamamlandı */}
                                          <div className="d-flex align-items-start position-relative">
                                            <div 
                                              className={`position-absolute rounded-circle border border-2 border-white shadow-sm ${order.isPayment ? 'bg-success' : 'bg-secondary bg-opacity-50'}`}
                                              style={{ left: '-16px', width: '14px', height: '14px', top: '4px' }}
                                            ></div>
                                            <div className="ms-2">
                                              <div className={`small fw-semibold ${order.isPayment ? 'text-success' : 'text-muted'}`}>
                                                <i className="bi bi-credit-card me-1"></i>Ödeme Tamamlandı
                                              </div>
                                              <div className="small text-muted">
                                                {order.isPayment ? 'Tamamlandı ✓' : 'Bekleniyor...'}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-3 pt-3 border-top">
                                          <div className="d-flex justify-content-between small mb-1">
                                            <span className="text-muted">İlerleme</span>
                                            <span className="fw-semibold">
                                              {order.isPayment ? '100%' : order.shippedDate ? '66%' : '33%'}
                                            </span>
                                          </div>
                                          <div className="progress" style={{ height: '8px' }}>
                                            <div 
                                              className={`progress-bar ${order.isPayment ? 'bg-success' : order.shippedDate ? 'bg-warning' : 'bg-info'}`}
                                              style={{ 
                                                width: order.isPayment ? '100%' : order.shippedDate ? '66%' : '33%',
                                                transition: 'width 0.5s ease-in-out'
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Sağ: Finansal Bilgiler */}
                                    <div className="col-md-6">
                                      <div className="bg-white rounded-3 p-3 shadow-sm h-100">
                                        <h6 className="fw-bold mb-3 d-flex align-items-center">
                                          <span 
                                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                            style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #0d6efd 0%, #4d94ff 100%)' }}
                                          >
                                            <i className="bi bi-currency-exchange text-white" style={{ fontSize: '0.8rem' }}></i>
                                          </span>
                                          Finansal Bilgiler
                                        </h6>

                                        {/* Vade Bilgisi */}
                                        <div className="d-flex align-items-center p-2 rounded-2 mb-2" style={{ background: 'rgba(220, 53, 69, 0.1)' }}>
                                          <div className="rounded-circle bg-danger bg-opacity-25 p-2 me-3">
                                            <i className="bi bi-calendar-event text-danger"></i>
                                          </div>
                                          <div className="flex-grow-1">
                                            <div className="small text-muted">Vade Süresi</div>
                                            <div className="fw-semibold">{line.maturityDay} Gün</div>
                                          </div>
                                          <div className="text-end">
                                            <div className="small text-muted">Vade Tarihi</div>
                                            <div className="fw-semibold text-danger">{formatDate(line.maturityDate)}</div>
                                          </div>
                                        </div>

                                        {/* Döviz Kurları */}
                                        <div className="row g-2 mt-2">
                                          <div className="col-6">
                                            <div className="p-2 rounded-2 text-center" style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                                              <div className="d-flex align-items-center justify-content-center mb-1">
                                                <span className="badge bg-primary me-1">USD</span>
                                                <i className="bi bi-arrow-right small text-muted"></i>
                                              </div>
                                              <div className="fw-bold text-primary">{formatNumber(line.dolarRate)} ₺</div>
                                            </div>
                                          </div>
                                          <div className="col-6">
                                            <div className="p-2 rounded-2 text-center" style={{ background: 'rgba(111, 66, 193, 0.1)' }}>
                                              <div className="d-flex align-items-center justify-content-center mb-1">
                                                <span className="badge" style={{ background: '#6f42c1' }}>EUR</span>
                                                <i className="bi bi-arrow-right small text-muted"></i>
                                              </div>
                                              <div className="fw-bold" style={{ color: '#6f42c1' }}>{formatNumber(line.euroRate)} ₺</div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Ödeme Durumu Göstergesi */}
                                        <div className={`mt-3 p-3 rounded-2 text-center ${order.isPayment ? 'bg-success bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
                                          <i className={`bi ${order.isPayment ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-warning'} fs-4 mb-1`}></i>
                                          <div className={`fw-semibold ${order.isPayment ? 'text-success' : 'text-warning'}`}>
                                            {order.isPayment ? 'Ödeme Tamamlandı' : 'Ödeme Bekleniyor'}
                                          </div>
                                          {!order.isPayment && (
                                            <div className="small text-muted mt-1">
                                              Tahsil edilecek: <strong className="text-dark">{formatNumber(line.taxTotalPrice)} ₺</strong>
                                            </div>
                                          )}
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
