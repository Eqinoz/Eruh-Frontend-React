import { useState } from "react";
import { Badge, Card } from "react-bootstrap";
import { useGetDetailsOrderQuery } from "../services/orderService";
import type { OrderDtoModel } from "../models/orderDtoModel";
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";
import ExcelButton from "../common/ExcelButton";

function PastOrdersList() {
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
  // Teslim Edilmiş Siparişleri Filtrele (shippedDate dolu olanlar)
  const pastOrders = allOrders.filter((o) => o.shippedDate !== null);

  // Excel İşlemleri
  const columns = [
    { header: "Sipariş No", key: "id" },
    { header: "Müşteri", key: "customerName" },
    { header: "Sipariş Tarihi", key: "orderDate" },
    { header: "Teslim Tarihi", key: "shippedDate" },
    { header: "Tutar", key: "taxTotalPrice" },
    { header: "Ödeme Durumu", key: "paymentStatus" },
  ];

  const excelData = pastOrders.map((item) => ({
    id: item.id,
    customerName: item.customerName,
    orderDate: formatDate(item.orderDate),
    shippedDate: formatDate(item.shippedDate),
    taxTotalPrice: formatNumber(item.lines.taxTotalPrice) + " ₺",
    paymentStatus: item.isPayment ? "Ödendi" : "Bekliyor",
  }));

  return (
    <Card className="shadow-lg border-0">
      <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-clock-history me-2"></i>Geçmiş Siparişler
        </h5>
        <Badge bg="light" text="dark" className="fs-6">
          {pastOrders.length} Sipariş
        </Badge>
        <ExcelButton
          data={excelData}
          columns={columns}
          fileName="Gecmis-Siparisler"
          title="Geçmiş Siparişler"
          disabled={isLoading}
        />
      </div>

      <Card.Body className="p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="thead-fistik">
              <tr>
                <th style={{ width: "40px" }}></th>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Sipariş Tarihi</th>
                <th>Teslim Tarihi</th>
                <th className="text-end">Tutar</th>
                <th className="text-center">Ödeme Durumu</th>
              </tr>
            </thead>
            <tbody>
              {pastOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    Tamamlanmış sipariş bulunamadı.
                  </td>
                </tr>
              ) : (
                pastOrders.map((order, index) => {
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
                        <td className="fw-bold text-primary">
                          {order.customerName}
                        </td>
                        <td>{formatDate(order.orderDate)}</td>
                        <td>
                          <i className="bi bi-truck text-success me-1"></i>
                          {formatDate(order.shippedDate)}
                        </td>
                        <td className="text-end fw-bold text-dark">
                          {formatNumber(line.taxTotalPrice)} ₺
                        </td>
                        <td className="text-center">
                          {order.isPayment ? (
                            <Badge bg="success">
                              <i className="bi bi-check-circle me-1"></i>Ödendi
                            </Badge>
                          ) : (
                            <Badge bg="warning" text="dark">
                              <i className="bi bi-hourglass-split me-1"></i>Bekliyor
                            </Badge>
                          )}
                        </td>
                      </tr>

                      {/* --- DETAY (ZENGİN ACCORDION) --- */}
                      {expandedRowIndex === index && (
                        <tr>
                          <td colSpan={7} className="p-0 border-0">
                            <div
                              className="border-bottom"
                              style={{
                                background:
                                  "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                                animation: "slideDown 0.3s ease-out",
                              }}
                            >
                              {/* Üst Mini Kartlar - Özet Bilgiler */}
                              <div
                                className="p-3 border-bottom"
                                style={{ background: "rgba(74, 124, 89, 0.05)" }}
                              >
                                <div className="row g-2">
                                  <div className="col-6 col-md-3">
                                    <div className="bg-white rounded-3 p-3 text-center shadow-sm h-100">
                                      <div className="d-flex align-items-center justify-content-center mb-2">
                                        <div
                                          className="rounded-circle d-flex align-items-center justify-content-center"
                                          style={{
                                            width: 40,
                                            height: 40,
                                            background:
                                              "linear-gradient(135deg, #4a7c59 0%, #6b9b7a 100%)",
                                          }}
                                        >
                                          <i className="bi bi-box text-white"></i>
                                        </div>
                                      </div>
                                      <div
                                        className="small text-muted text-uppercase"
                                        style={{
                                          fontSize: "0.7rem",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Miktar
                                      </div>
                                      <div className="fw-bold text-dark fs-5">
                                        {line.amount}{" "}
                                        <span className="small text-muted">KG</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6 col-md-3">
                                    <div className="bg-white rounded-3 p-3 text-center shadow-sm h-100">
                                      <div className="d-flex align-items-center justify-content-center mb-2">
                                        <div
                                          className="rounded-circle d-flex align-items-center justify-content-center"
                                          style={{
                                            width: 40,
                                            height: 40,
                                            background:
                                              "linear-gradient(135deg, #0d6efd 0%, #4d94ff 100%)",
                                          }}
                                        >
                                          <i className="bi bi-tag text-white"></i>
                                        </div>
                                      </div>
                                      <div
                                        className="small text-muted text-uppercase"
                                        style={{
                                          fontSize: "0.7rem",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Birim Fiyat
                                      </div>
                                      <div className="fw-bold text-primary fs-5">
                                        {formatNumber(line.unitPrice)}{" "}
                                        <span className="small">₺</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6 col-md-3">
                                    <div className="bg-white rounded-3 p-3 text-center shadow-sm h-100">
                                      <div className="d-flex align-items-center justify-content-center mb-2">
                                        <div
                                          className="rounded-circle d-flex align-items-center justify-content-center"
                                          style={{
                                            width: 40,
                                            height: 40,
                                            background:
                                              "linear-gradient(135deg, #ffc107 0%, #ffda6a 100%)",
                                          }}
                                        >
                                          <i className="bi bi-percent text-dark"></i>
                                        </div>
                                      </div>
                                      <div
                                        className="small text-muted text-uppercase"
                                        style={{
                                          fontSize: "0.7rem",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        KDV (%{line.taxRate})
                                      </div>
                                      <div className="fw-bold text-warning fs-5">
                                        {formatNumber(line.taxAmount)}{" "}
                                        <span className="small">₺</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6 col-md-3">
                                    <div
                                      className="rounded-3 p-3 text-center shadow-sm h-100"
                                      style={{
                                        background:
                                          "linear-gradient(135deg, #198754 0%, #28a745 100%)",
                                      }}
                                    >
                                      <div className="d-flex align-items-center justify-content-center mb-2">
                                        <div
                                          className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center"
                                          style={{ width: 40, height: 40 }}
                                        >
                                          <i className="bi bi-cash-stack text-white"></i>
                                        </div>
                                      </div>
                                      <div
                                        className="small text-white text-opacity-75 text-uppercase"
                                        style={{
                                          fontSize: "0.7rem",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        Toplam
                                      </div>
                                      <div className="fw-bold text-white fs-5">
                                        {formatNumber(line.taxTotalPrice)}{" "}
                                        <span className="small">₺</span>
                                      </div>
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
                                          style={{
                                            width: 28,
                                            height: 28,
                                            background:
                                              "linear-gradient(135deg, #4a7c59 0%, #6b9b7a 100%)",
                                          }}
                                        >
                                          <i
                                            className="bi bi-clock-history text-white"
                                            style={{ fontSize: "0.8rem" }}
                                          ></i>
                                        </span>
                                        Sipariş Durumu
                                      </h6>

                                      {/* Timeline */}
                                      <div className="position-relative ps-4">
                                        <div
                                          className="position-absolute"
                                          style={{
                                            left: "11px",
                                            top: "8px",
                                            bottom: "8px",
                                            width: "2px",
                                            background:
                                              "linear-gradient(to bottom, #198754, #198754, " +
                                              (order.isPayment ? "#198754" : "#ffc107") +
                                              ")",
                                          }}
                                        ></div>

                                        {/* Sipariş Alındı */}
                                        <div className="d-flex align-items-start mb-3 position-relative">
                                          <div
                                            className="position-absolute bg-success rounded-circle border border-2 border-white shadow-sm"
                                            style={{
                                              left: "-16px",
                                              width: "14px",
                                              height: "14px",
                                              top: "4px",
                                            }}
                                          ></div>
                                          <div className="ms-2">
                                            <div className="small fw-semibold text-success">
                                              Sipariş Alındı
                                            </div>
                                            <div className="small text-muted">
                                              {formatDate(order.orderDate)}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Teslim Edildi */}
                                        <div className="d-flex align-items-start mb-3 position-relative">
                                          <div
                                            className="position-absolute bg-success rounded-circle border border-2 border-white shadow-sm"
                                            style={{
                                              left: "-16px",
                                              width: "14px",
                                              height: "14px",
                                              top: "4px",
                                            }}
                                          ></div>
                                          <div className="ms-2">
                                            <div className="small fw-semibold text-success">
                                              <i className="bi bi-truck me-1"></i>
                                              Teslim Edildi
                                            </div>
                                            <div className="small text-muted">
                                              {formatDate(order.shippedDate)}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Ödeme */}
                                        <div className="d-flex align-items-start position-relative">
                                          <div
                                            className={`position-absolute rounded-circle border border-2 border-white shadow-sm ${
                                              order.isPayment
                                                ? "bg-success"
                                                : "bg-warning"
                                            }`}
                                            style={{
                                              left: "-16px",
                                              width: "14px",
                                              height: "14px",
                                              top: "4px",
                                            }}
                                          ></div>
                                          <div className="ms-2">
                                            <div
                                              className={`small fw-semibold ${
                                                order.isPayment
                                                  ? "text-success"
                                                  : "text-warning"
                                              }`}
                                            >
                                              <i className="bi bi-credit-card me-1"></i>
                                              {order.isPayment
                                                ? "Ödeme Tamamlandı"
                                                : "Ödeme Bekleniyor"}
                                            </div>
                                            <div className="small text-muted">
                                              {order.isPayment
                                                ? "Tamamlandı ✓"
                                                : "Bekleniyor..."}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Progress Bar */}
                                      <div className="mt-3 pt-3 border-top">
                                        <div className="d-flex justify-content-between small mb-1">
                                          <span className="text-muted">İlerleme</span>
                                          <span className="fw-semibold">
                                            {order.isPayment ? "100%" : "66%"}
                                          </span>
                                        </div>
                                        <div
                                          className="progress"
                                          style={{ height: "8px" }}
                                        >
                                          <div
                                            className={`progress-bar ${
                                              order.isPayment
                                                ? "bg-success"
                                                : "bg-warning"
                                            }`}
                                            style={{
                                              width: order.isPayment ? "100%" : "66%",
                                              transition: "width 0.5s ease-in-out",
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
                                          style={{
                                            width: 28,
                                            height: 28,
                                            background:
                                              "linear-gradient(135deg, #0d6efd 0%, #4d94ff 100%)",
                                          }}
                                        >
                                          <i
                                            className="bi bi-currency-exchange text-white"
                                            style={{ fontSize: "0.8rem" }}
                                          ></i>
                                        </span>
                                        Finansal Bilgiler
                                      </h6>

                                      {/* Vade Bilgisi */}
                                      <div
                                        className="d-flex align-items-center p-2 rounded-2 mb-2"
                                        style={{
                                          background: "rgba(220, 53, 69, 0.1)",
                                        }}
                                      >
                                        <div className="rounded-circle bg-danger bg-opacity-25 p-2 me-3">
                                          <i className="bi bi-calendar-event text-danger"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                          <div className="small text-muted">
                                            Vade Süresi
                                          </div>
                                          <div className="fw-semibold">
                                            {line.maturityDay} Gün
                                          </div>
                                        </div>
                                        <div className="text-end">
                                          <div className="small text-muted">
                                            Vade Tarihi
                                          </div>
                                          <div className="fw-semibold text-danger">
                                            {formatDate(line.maturityDate)}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Döviz Kurları */}
                                      <div className="row g-2 mt-2">
                                        <div className="col-6">
                                          <div
                                            className="p-2 rounded-2 text-center"
                                            style={{
                                              background: "rgba(13, 110, 253, 0.1)",
                                            }}
                                          >
                                            <div className="d-flex align-items-center justify-content-center mb-1">
                                              <span className="badge bg-primary me-1">
                                                USD
                                              </span>
                                              <i className="bi bi-arrow-right small text-muted"></i>
                                            </div>
                                            <div className="fw-bold text-primary">
                                              {formatNumber(line.dolarRate)} ₺
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-6">
                                          <div
                                            className="p-2 rounded-2 text-center"
                                            style={{
                                              background: "rgba(111, 66, 193, 0.1)",
                                            }}
                                          >
                                            <div className="d-flex align-items-center justify-content-center mb-1">
                                              <span
                                                className="badge"
                                                style={{ background: "#6f42c1" }}
                                              >
                                                EUR
                                              </span>
                                              <i className="bi bi-arrow-right small text-muted"></i>
                                            </div>
                                            <div
                                              className="fw-bold"
                                              style={{ color: "#6f42c1" }}
                                            >
                                              {formatNumber(line.euroRate)} ₺
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Ödeme Durumu Göstergesi */}
                                      <div
                                        className={`mt-3 p-3 rounded-2 text-center ${
                                          order.isPayment
                                            ? "bg-success bg-opacity-10"
                                            : "bg-warning bg-opacity-10"
                                        }`}
                                      >
                                        <i
                                          className={`bi ${
                                            order.isPayment
                                              ? "bi-check-circle-fill text-success"
                                              : "bi-exclamation-triangle-fill text-warning"
                                          } fs-4 mb-1`}
                                        ></i>
                                        <div
                                          className={`fw-semibold ${
                                            order.isPayment
                                              ? "text-success"
                                              : "text-warning"
                                          }`}
                                        >
                                          {order.isPayment
                                            ? "Ödeme Tamamlandı"
                                            : "Ödeme Bekleniyor"}
                                        </div>
                                        {!order.isPayment && (
                                          <div className="small text-muted mt-1">
                                            Tahsil edilecek:{" "}
                                            <strong className="text-dark">
                                              {formatNumber(line.taxTotalPrice)} ₺
                                            </strong>
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
  );
}

export default PastOrdersList;
