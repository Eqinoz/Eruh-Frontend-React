import { useState } from "react";
import { Badge, Button, Spinner } from "react-bootstrap";
import {
  useCompletePaymentMutation,
  useGetDetailsOrderQuery,
} from "../services/orderService";
import type { OrderDtoModel } from "../models/orderDtoModel";
import { formatCurrency, formatDate, formatNumber } from "../utilities/formatters";
import { toast } from "react-toastify";
import "./css/RawMaterialList.css";
import ExcelButton from "../common/ExcelButton";

function PaymentListPage() {
  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetDetailsOrderQuery();
  const [receivePayment, { isLoading: isReceiving }] =
    useCompletePaymentMutation();
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  const handleReceivePayment = async (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation();
    if (!window.confirm(`Sipariş #${orderId} için ödemeyi onaylıyor musunuz?`))
      return;

    try {
      await receivePayment(orderId).unwrap();
      toast.success(`Sipariş #${orderId} tahsilatı yapıldı! 💸`);
    } catch (err: any) {
      toast.error("Tahsilat işlemi başarısız oldu.");
    }
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const allOrders: OrderDtoModel[] = ordersResponse?.data || [];
  const waitingForPayment = allOrders.filter(
    (o) => o.shippedDate !== null && o.isPayment === false
  );

  //Excel İşlemleri
  const columns = [
    { header: "Sipariş No", key: "id" },
    { header: "Müşteri", key: "customerName" },
    { header: "Teslim Tarihi", key: "shippedDate" },
    { header: "Vade", key: "maturityDay" },
    { header: "Vade Tarihi", key: "maturityDate" },
    { header: "Tutar", key: "taxTotalPrice" },
  ];

  const excelData = ordersResponse?.data.map((item) => ({
    id: item.id,
    customerName: item.customerName,
    shippedDate: formatDate(item.shippedDate),
    maturityDay: item.lines.maturityDay,
    maturityDate: formatDate(item.lines.maturityDate),
    taxTotalPrice: formatCurrency(item.lines.taxTotalPrice),
  })) ?? [];

  return (
      <div className="card shadow-lg border-0">
        <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-hourglass-split me-2"></i>Ödeme Bekleyenler
          </h5>
          <Badge bg="dark" className="fs-6">
            {waitingForPayment.length} Adet
          </Badge>
          <ExcelButton 
            data={excelData} 
            columns={columns} 
            fileName="Ödeme-Bekleyenler"
            title="Ödeme Bekleyen İşlemler"
            disabled={isLoading} 
          />
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-warning">
              <tr>
                <th style={{ width: "40px" }}></th>
                <th>Müşteri</th>
                <th>Teslim Tarihi</th>
                <th className="text-center">Vade</th>
                <th>Vade Tarihi</th>
                <th className="text-end">Tutar</th>
                <th className="text-center">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {waitingForPayment.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    <i className="bi bi-check2-all fs-1 d-block mb-2 text-success"></i>
                    Ödeme bekleyen sipariş yok.
                  </td>
                </tr>
              ) : (
                waitingForPayment.map((order, index) => {
                  const line = order.lines;
                  return (
                    <>
                      <tr
                        key={order.id}
                        onClick={() => toggleRow(index)}
                        style={{ cursor: "pointer" }}
                        className={
                          expandedRowIndex === index
                            ? "bg-light border-start border-5 border-warning"
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
                        <td className="fw-bold text-dark">
                          {order.customerName}
                        </td>
                        <td>{formatDate(order.shippedDate!)}</td>
                        <td className="text-center">
                          <Badge bg="info" text="dark">
                            {line.maturityDay} Gün
                          </Badge>
                        </td>
                        <td className="fw-bold text-danger">
                          {formatDate(line.maturityDate)}
                        </td>
                        <td className="text-end fw-bold text-dark fs-5">
                          {formatNumber(line.taxTotalPrice)} ₺
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="success"
                            className="text-white fw-bold shadow-sm"
                            onClick={(e) => handleReceivePayment(e, order.id)}
                            disabled={isReceiving}
                          >
                            {isReceiving ? (
                              <Spinner size="sm" animation="border" />
                            ) : (
                              <>
                                <i className="bi bi-cash-coin me-1"></i> Tahsil
                                Et
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>

                      {/* 🎨 DETAYLANDIRILMIŞ ACCORDION */}
                      {expandedRowIndex === index && (
                        <tr>
                          <td colSpan={7} className="p-0 border-0">
                            <div className="p-4 bg-white border-bottom shadow-inner">
                              {/* 1. ÜST BİLGİ ŞERİDİ (Zaman Çizelgesi gibi) */}
                              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-4 border">
                                <div className="d-flex align-items-center text-muted">
                                  <i className="bi bi-receipt fs-4 me-2"></i>
                                  <div>
                                    <small
                                      className="d-block"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      Sipariş Tarihi
                                    </small>
                                    <span className="fw-bold text-dark">
                                      {formatDate(order.orderDate)}
                                    </span>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center text-primary">
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
                                <div className="d-flex align-items-center text-danger">
                                  <i className="bi bi-calendar-x fs-4 me-2"></i>
                                  <div>
                                    <small
                                      className="d-block"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      Son Ödeme Tarihi
                                    </small>
                                    <span className="fw-bold">
                                      {formatDate(line.maturityDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="row g-4">
                                {/* 2. SOL KART: Ürün ve Vergi Dökümü */}
                                <div className="col-md-4">
                                  <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-header bg-white border-bottom fw-bold text-secondary">
                                      <i className="bi bi-basket me-2"></i>Ürün
                                      & Fatura Detayı
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
                                            Miktar:
                                          </span>
                                          <span className="fw-bold">
                                            {line.amount}
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
                                            Ara Toplam:
                                          </span>
                                          <span className="fw-bold">
                                            {formatNumber(line.totalPrice)} ₺
                                          </span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                          <span className="text-danger">
                                            KDV (%{line.taxRate}):
                                          </span>
                                          <span className="text-danger">
                                            +{formatNumber(line.taxAmount)} ₺
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                {/* 3. ORTA KART: Döviz Kurları (İşlem Anı) */}
                                <div className="col-md-4">
                                  <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-header bg-white border-bottom fw-bold text-primary">
                                      <i className="bi bi-currency-exchange me-2"></i>
                                      İşlem Anı Kurları
                                    </div>
                                    <div className="card-body d-flex flex-column justify-content-center">
                                      <div className="d-flex align-items-center justify-content-between p-3 border rounded mb-3 bg-light">
                                        <div className="d-flex align-items-center">
                                          <span className="fs-2 me-3">🇺🇸</span>
                                          <div>
                                            <span className="d-block text-muted small">
                                              USD / TRY
                                            </span>
                                            <span className="fw-bold fs-5 text-success">
                                              {formatNumber(line.dolarRate)} ₺
                                            </span>
                                          </div>
                                        </div>
                                        <i className="bi bi-graph-up-arrow text-success"></i>
                                      </div>
                                      <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light">
                                        <div className="d-flex align-items-center">
                                          <span className="fs-2 me-3">🇪🇺</span>
                                          <div>
                                            <span className="d-block text-muted small">
                                              EUR / TRY
                                            </span>
                                            <span
                                              className="fw-bold fs-5 text-warning"
                                              style={{ color: "#fd7e14" }}
                                            >
                                              {formatNumber(line.euroRate)} ₺
                                            </span>
                                          </div>
                                        </div>
                                        <i className="bi bi-graph-up-arrow text-warning"></i>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 4. SAĞ KART: Büyük Toplam */}
                                <div className="col-md-4">
                                  <div className="card h-100 border-success shadow-sm bg-success bg-opacity-10">
                                    <div className="card-body d-flex flex-column justify-content-center text-center">
                                      <h6 className="text-success text-uppercase letter-spacing-1 mb-3">
                                        Tahsil Edilecek Net Tutar
                                      </h6>
                                      <h1 className="display-5 fw-bold text-success mb-0">
                                        {formatNumber(line.taxTotalPrice)}
                                        <span className="fs-4 ms-1">₺</span>
                                      </h1>
                                      <hr className="border-success opacity-25 w-50 mx-auto my-3" />
                                      <small className="text-success fw-bold">
                                        <i className="bi bi-info-circle me-1"></i>
                                        KDV Dahildir
                                      </small>
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

export default PaymentListPage;
