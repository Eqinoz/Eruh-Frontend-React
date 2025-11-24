import { useState } from "react";
import { Badge, Button, Spinner } from "react-bootstrap"; // Spinner ekledim
import { useGetDetailsOrderQuery } from "../services/orderService";
import type { OrderDtoModel } from "../models/orderDtoModel";
import { formatDate, formatNumber } from "../utilities/formatters";
import { toast } from "react-toastify"; // Bildirim için
import "./css/RawMaterialList.css";

function OrderDetailsList() {
  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetDetailsOrderQuery();
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  // 🎨 SİPARİŞ DURUMLARINI TUTMAK İÇİN STATE
  // Gerçekte bu bilgi backend'den 'order.status' veya 'order.isCompleted' olarak gelmeli.
  // Şimdilik burada simüle ediyoruz. ID'si buraya eklenenler "Tamamlandı" sayılacak.
  const [completedOrderIds, setCompletedOrderIds] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  // 🎨 SİPARİŞ TAMAMLAMA FONKSİYONU
  const handleCompleteOrder = (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation(); // Satırın açılmasını engelle

    // Burada normalde backend'e istek atacağız: await completeOrder(orderId)...

    // UI Güncellemesi (Simülasyon)
    setCompletedOrderIds((prev) => [...prev, orderId]);
    toast.success(`Sipariş #${orderId} başarıyla teslim edildi! 🎉`);
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const orders: OrderDtoModel[] = ordersResponse?.data || [];

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header card-header-fistik text-white">
          <h5 className="mb-0">
            <i className="bi bi-receipt-cutoff me-2"></i>Sipariş Listesi
          </h5>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="thead-fistik">
              <tr>
                <th style={{ width: "40px" }}></th>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Sipariş Tarihi</th>
                <th className="text-end">Genel Toplam</th>
                <th className="text-center">Durum & İşlem</th>{" "}
                {/* Başlığı güncelledim */}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    Kayıtlı sipariş bulunamadı.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const line = order.lines;

                  // Bu sipariş daha önce tamamlandı mı kontrol et
                  const isCompleted = completedOrderIds.includes(order.id);

                  return (
                    <>
                      {/* --- ANA SATIR --- */}
                      <tr
                        key={order.id}
                        onClick={() => toggleRow(index)}
                        style={{ cursor: "pointer" }}
                        className={
                          expandedRowIndex === index ? "table-active" : ""
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

                        <td className="text-end fw-bold text-success fs-5">
                          {formatNumber(line.taxTotalPrice)} ₺
                        </td>

                        {/* 🎨 İŞTE OLAY BURADA: DURUM KOLONU */}
                        <td className="text-center">
                          {isCompleted ? (
                            // ✅ DURUM 1: TAMAMLANDI
                            <Badge
                              bg="success"
                              className="px-3 py-2 rounded-pill"
                            >
                              <i className="bi bi-check-circle-fill me-1"></i>{" "}
                              Teslim Edildi
                            </Badge>
                          ) : (
                            // ⏳ DURUM 2: HAZIRLANIYOR (Hoş Bir Şeyler)
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              {/* Yanıp sönen "Hazırlanıyor" rozeti */}
                              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill position-relative border border-warning">
                                <Spinner
                                  animation="grow"
                                  variant="dark"
                                  size="sm"
                                  className="me-2"
                                  style={{ width: "0.7rem", height: "0.7rem" }}
                                />
                                Hazırlanıyor...
                                {/* Küçük animasyonlu nokta */}
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                  <span className="visually-hidden">
                                    New alerts
                                  </span>
                                </span>
                              </span>

                              {/* Tamamla Butonu */}
                              <Button
                                size="sm"
                                variant="outline-success"
                                className="rounded-circle"
                                title="Siparişi Tamamla"
                                onClick={(e) =>
                                  handleCompleteOrder(e, order.id)
                                }
                              >
                                <i className="bi bi-check-lg"></i>
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* --- DETAY SATIRI --- */}
                      {expandedRowIndex === index && (
                        <tr>
                          <td colSpan={6} className="p-0 border-0">
                            <div className="p-3 bg-light border-bottom shadow-inner">
                              <table className="table table-sm table-bordered bg-white mb-0 font-size-sm">
                                <thead className="table-light text-muted small">
                                  <tr>
                                    <th>Ürün Adı</th>
                                    <th className="text-center">Miktar</th>
                                    <th className="text-end">Birim Fiyat</th>
                                    <th className="text-end">KDV</th>
                                    <th className="text-center">Vade</th>
                                    <th className="text-center">Kur</th>
                                    <th className="text-end">Satır Toplamı</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="fw-bold text-dark">
                                      {line.productName}
                                    </td>
                                    <td className="text-center">
                                      {line.amount}
                                    </td>
                                    <td className="text-end">
                                      {formatNumber(line.unitPrice)} ₺
                                    </td>

                                    <td className="text-end text-danger small">
                                      {formatNumber(line.taxAmount)} ₺ <br /> (%
                                      {line.taxRate})
                                    </td>

                                    <td className="text-center small">
                                      <div className="fw-bold">
                                        {line.maturityDay} Gün
                                      </div>
                                      <div className="text-muted">
                                        {formatDate(line.maturityDate)}
                                      </div>
                                    </td>

                                    <td className="text-center small">
                                      <div>
                                        <span className="text-success">$</span>{" "}
                                        {formatNumber(line.dolarRate)}
                                      </div>
                                      <div>
                                        <span
                                          className="text-warning"
                                          style={{ color: "#fd7e14" }}
                                        >
                                          €
                                        </span>{" "}
                                        {formatNumber(line.euroRate)}
                                      </div>
                                    </td>

                                    <td className="text-end fw-bold text-success">
                                      {formatNumber(line.taxTotalPrice)} ₺
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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

export default OrderDetailsList;
