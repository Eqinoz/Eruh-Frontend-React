import { useState } from "react";
import { Badge, Button, Spinner } from "react-bootstrap";
import {
  useGetDetailsOrderQuery,
  useCompleteOrderMutation,
} from "../services/orderService";
import type { OrderDtoModel } from "../models/orderDtoModel";
import { formatCurrency, formatDate, formatNumber } from "../utilities/formatters";
import { toast } from "react-toastify";
import "./css/RawMaterialList.css";
import ExcelButton from "../common/ExcelButton";



function OrderDetailsList() {
  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetDetailsOrderQuery();
  const [completeOrder, { isLoading: isUpdating }] = useCompleteOrderMutation();
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };



  const handleCompleteOrder = async (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Bu siparişi teslim edip ödeme ekranına aktarmak istiyor musunuz?"
      )
    )
      return;

    try {



      const now = new Date().toISOString();
      await completeOrder({ id: orderId, shippedDate: now }).unwrap();
      toast.success(
        `Sipariş #${orderId} sevkiyatı tamamlandı! Ödemeler sayfasına aktarıldı.`
      );
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  //Excel İşlemleri
  const columns = [
    { header: "Sipariş No", key: "id" },
    { header: "Müşteri", key: "customerName" },
    { header: "Sipariş Tarihi", key: "orderDate" },
    { header: "Tutar", key: "taxTotalPrice" },
  ];

  const excelData = ordersResponse?.data.map((item) => ({
    id: item.id,
    customerName: item.customerName,
    orderDate: formatDate(item.orderDate),
    taxTotalPrice: formatCurrency(item.lines.taxTotalPrice),
  })) ?? [];

  const allOrders: OrderDtoModel[] = ordersResponse?.data || [];
  // 🧠 Sadece Bekleyenleri (Hazırlananları) Filtrele
  const pendingOrders = allOrders.filter((o) => o.shippedDate === null);

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-box-seam me-2"></i>Bekleyen Siparişler
          </h5>
          <Badge bg="light" text="dark" className="fs-6">
            {pendingOrders.length} Sipariş
          </Badge>
          <ExcelButton 
            data={excelData} 
            columns={columns} 
            fileName="Bekleyen-Siparişler"
            disabled={isLoading} 
          />
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="thead-fistik">
              <tr>
                <th style={{ width: "40px" }}></th>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Sipariş Tarihi</th>
                <th className="text-end">Tutar</th>
                <th className="text-center">Durum & İşlem</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    Hazırlanacak yeni sipariş yok.
                  </td>
                </tr>
              ) : (
                pendingOrders.map((order, index) => {
                  const line = order.lines;
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
                        <td className="text-end fw-bold text-dark">
                          {formatNumber(line.taxTotalPrice)} ₺
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-success"
                            className="rounded-pill px-3 d-flex align-items-center mx-auto"
                            onClick={(e) => handleCompleteOrder(e, order.id)}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <Spinner
                                size="sm"
                                animation="border"
                                className="me-2"
                              />
                            ) : (
                              <i className="bi bi-truck me-2"></i>
                            )}
                            Teslim Et
                          </Button>
                        </td>
                      </tr>

                      {/* --- DETAY (ZENGİNLEŞTİRİLMİŞ ACCORDION) --- */}
                      {expandedRowIndex === index && (
                        <tr>
                          <td colSpan={6} className="p-0 border-0">
                            <div className="p-4 bg-white border-bottom shadow-inner">
                              <div className="row g-4">
                                {/* 1. KART: Müşteri ve Personel Bilgisi */}
                                <div className="col-md-4">
                                  <div className="card h-100 border-0 bg-light">
                                    <div className="card-body">
                                      <h6 className="card-title text-primary fw-bold border-bottom pb-2 mb-3">
                                        <i className="bi bi-person-vcard me-2"></i>
                                        Cari Bilgileri
                                      </h6>
                                      <p className="mb-2">
                                        <strong>Müşteri:</strong>{" "}
                                        {order.customerName}
                                      </p>
                                      {/* Modelde employee varsa buraya ekle */}
                                      {/* <p className="mb-2"><strong>Satış Temsilcisi:</strong> {order.employee}</p> */}
                                      <p className="mb-0 text-muted small">
                                        Sipariş Tarihi:{" "}
                                        {formatDate(order.orderDate)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* 2. KART: Ürün Detayları */}
                                <div className="col-md-8">
                                  <div className="card h-100 border-0 border-start border-4 border-warning">
                                    <div className="card-body">
                                      <h6 className="card-title text-dark fw-bold border-bottom pb-2 mb-3">
                                        <i className="bi bi-basket me-2"></i>
                                        Ürün İçeriği
                                      </h6>
                                      <div className="table-responsive">
                                        <table className="table table-sm table-borderless mb-0">
                                          <thead className="text-muted small border-bottom">
                                            <tr>
                                              <th>Ürün</th>
                                              <th className="text-center">
                                                Miktar
                                              </th>
                                              <th className="text-end">
                                                Birim Fiyat
                                              </th>
                                              <th className="text-end">
                                                Tutar
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td className="fw-bold">
                                                {line.productName}
                                              </td>
                                              <td className="text-center">
                                                <Badge bg="secondary">
                                                  {line.amount}
                                                </Badge>
                                              </td>
                                              <td className="text-end">
                                                {formatNumber(line.unitPrice)} ₺
                                              </td>
                                              <td className="text-end fw-bold text-success">
                                                {formatNumber(
                                                  line.taxTotalPrice
                                                )}{" "}
                                                ₺
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">
                                          <i className="bi bi-info-circle me-1"></i>
                                          Ödeme Vadesi: {line.maturityDay} Gün
                                        </span>
                                        <span className="text-muted small">
                                          <i className="bi bi-calendar-check me-1"></i>
                                          Vade Tarihi:{" "}
                                          {formatDate(line.maturityDate)}
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

export default OrderDetailsList;
