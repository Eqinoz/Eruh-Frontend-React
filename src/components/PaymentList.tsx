import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { useGetDetailsOrderQuery } from "../services/orderService";
import { useGetOpeningBalanceDetailsQuery } from "../services/customerService";
import type { OrderDtoModel } from "../models/orderDtoModel";
import type { OpeningBalanceDetail } from "../models/financialTransactionModel";
import { formatCurrency, formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";
import ExcelButton from "../common/ExcelButton";
import PartialPaymentModal from "./modals/PartialPaymentModal";

// Birleşik liste elemanı tipi
type PaymentListItem = 
  | { type: 'ORDER'; data: OrderDtoModel }
  | { type: 'DEBT'; data: OpeningBalanceDetail };

function PaymentListPage() {
  // 1. Siparişleri getir
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetDetailsOrderQuery();

  // 2. Devir borç detaylarını getir
  const {
    data: debtResponse,
    isLoading: isDebtLoading,
    isError: isDebtError,
  } = useGetOpeningBalanceDetailsQuery();
  
  const isLoading = isOrdersLoading || isDebtLoading;
  const isError = isOrdersError || isDebtError;

  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  
  // Kısmi ödeme modal state'leri
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ item: OrderDtoModel | OpeningBalanceDetail, isOrder: boolean } | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  const handleOpenPaymentModal = (e: React.MouseEvent, item: OrderDtoModel | OpeningBalanceDetail, isOrder: boolean) => {
    e.stopPropagation();
    setSelectedItem({ item, isOrder });
    setShowPaymentModal(true);
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  // VERİLERİ FİLTRELE VE BİRLEŞTİR
  const orderList: PaymentListItem[] = (ordersResponse?.data || [])
    .filter((o) => o.shippedDate !== null && o.isPayment === false)
    .map(o => ({ type: 'ORDER', data: o }));

  // Devir borçlarında remainingAmount > 0 olanları listeleyelim (veya isDebt=true olanları, kullanıcı isteğine göre)
  // Kullanıcı "isDebt": true örneği verdi.
  const debtList: PaymentListItem[] = (debtResponse?.data || [])
    .filter((d) => d.remainingAmount > 0) 
    .map(d => ({ type: 'DEBT', data: d }));

  // İki listeyi birleştir
  const combinedList = [...debtList, ...orderList];
  // İsteğe bağlı: Tarihe göre sıralama yapılabilir. Şimdilik devir borçları en üstte olsun.

  // Toplam kalan borç
  const totalRemainingAmount = combinedList.reduce((sum, item) => {
    if (item.type === 'ORDER') {
      const order = item.data;
      return sum + (order.remainingAmount ?? order.lines.taxTotalPrice);
    } else {
      const debt = item.data;
      return sum + debt.remainingAmount;
    }
  }, 0);

  // Excel Verisi Hazırla
  const excelColumns = [
    { header: "Tip", key: "type" },
    { header: "ID", key: "id" },
    { header: "Müşteri", key: "customerName" },
    { header: "Tarih", key: "date" },
    { header: "Açıklama/Vade", key: "description" },
    { header: "Toplam Tutar", key: "totalAmount" },
    { header: "Ödenen", key: "paidAmount" },
    { header: "Kalan Borç", key: "remainingAmount" },
  ];

  const excelData = combinedList.map((listItem) => {
    if (listItem.type === 'ORDER') {
      const item = listItem.data;
      return {
        type: "Sipariş",
        id: item.id,
        customerName: item.customerName,
        date: formatDate(item.shippedDate!),
        description: `Vade: ${formatDate(item.lines.maturityDate)}`,
        totalAmount: formatCurrency(item.totalOrderAmount ?? item.lines.taxTotalPrice),
        paidAmount: formatCurrency(item.paidAmount ?? 0),
        remainingAmount: formatCurrency(item.remainingAmount ?? item.lines.taxTotalPrice),
      };
    } else {
      const item = listItem.data;
      return {
        type: "Devir Borç",
        id: item.id,
        customerName: item.customerName,
        date: formatDate(item.date),
        description: item.description,
        totalAmount: formatCurrency(item.totalDevirAmount),
        paidAmount: formatCurrency(item.paidAmount),
        remainingAmount: formatCurrency(item.remainingAmount),
      };
    }
  });

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-hourglass-split me-2"></i>Ödeme Bekleyenler
          </h5>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="dark" className="fs-6">
              {combinedList.length} Adet
            </Badge>
            <Badge bg="danger" className="fs-6">
              Toplam: {formatNumber(totalRemainingAmount)} ₺
            </Badge>
            <ExcelButton 
              data={excelData} 
              columns={excelColumns} 
              fileName="Odeme-Bekleyenler"
              title="Ödeme Bekleyen İşlemler"
              disabled={isLoading} 
            />
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-warning">
              <tr>
                <th style={{ width: "40px" }}></th>
                <th className="text-center" style={{ width: "80px" }}>Tip</th>
                <th>Müşteri</th>
                <th>Tarih</th>
                <th>Açıklama / Vade</th>
                <th className="text-end">Toplam</th>
                <th className="text-end">Ödenen</th>
                <th className="text-end">Kalan Borç</th>
                <th className="text-center">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {combinedList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted">
                    <i className="bi bi-check2-all fs-1 d-block mb-2 text-success"></i>
                    Ödeme bekleyen işlem yok.
                  </td>
                </tr>
              ) : (
                combinedList.map((listItem, index) => {
                  const isOrder = listItem.type === 'ORDER';
                  const item = listItem.data;
                  const itemDate = isOrder ? (item as OrderDtoModel).shippedDate! : (item as OpeningBalanceDetail).date;
                  
                  // Tutar hesaplamaları
                  let totalAmount = 0;
                  let paidAmount = 0;
                  let remainingAmount = 0;
                  let description = "";

                  if (isOrder) {
                    const order = item as OrderDtoModel;
                    totalAmount = order.totalOrderAmount ?? order.lines.taxTotalPrice;
                    paidAmount = order.paidAmount ?? 0;
                    remainingAmount = order.remainingAmount ?? order.lines.taxTotalPrice;
                    description = `Vade: ${formatDate(order.lines.maturityDate)}`;
                  } else {
                    const debt = item as OpeningBalanceDetail;
                    totalAmount = debt.totalDevirAmount;
                    paidAmount = debt.paidAmount;
                    remainingAmount = debt.remainingAmount;
                    description = debt.description;
                  }

                  const paymentProgress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
                  
                  return (
                    <>
                      <tr
                        key={`${listItem.type}-${item.id}`}
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
                        <td className="text-center">
                          {isOrder ? (
                            <Badge bg="primary" className="rounded-pill">Sipariş</Badge>
                          ) : (
                            <Badge bg="info" className="rounded-pill text-dark">Devir</Badge>
                          )}
                        </td>
                        <td className="fw-bold text-dark">
                          {item.customerName}
                        </td>
                        <td>{formatDate(itemDate)}</td>
                        <td className="text-muted small">
                          {isOrder ? (
                            <span className="fw-bold text-danger">{description}</span>
                          ) : (
                            <span>{description}</span>
                          )}
                        </td>
                        <td className="text-end text-muted">
                          {formatNumber(totalAmount)} ₺
                        </td>
                        <td className="text-end text-success">
                          {paidAmount > 0 ? (
                            <span className="fw-bold">{formatNumber(paidAmount)} ₺</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-end fw-bold text-danger fs-5">
                          {formatNumber(remainingAmount)} ₺
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="success"
                            className="text-white fw-bold shadow-sm"
                            onClick={(e) => handleOpenPaymentModal(e, item, isOrder)}
                          >
                            <i className="bi bi-cash-coin me-1"></i> Tahsil Et
                          </Button>
                        </td>
                      </tr>

                      {/* 🎨 DETAYLANDIRILMIŞ ACCORDION */}
                      {expandedRowIndex === index && (
                        <tr>
                          <td colSpan={9} className="p-0 border-0">
                            <div className="p-4 bg-white border-bottom shadow-inner">
                              
                              {/* 1. ÜST BİLGİ ŞERİDİ */}
                              {isOrder ? (
                                // SİPARİŞ DETAYLARI
                                <>
                                  <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-4 border">
                                    <div className="d-flex align-items-center text-muted">
                                      <i className="bi bi-receipt fs-4 me-2"></i>
                                      <div>
                                        <small className="d-block" style={{ fontSize: "0.7rem" }}>Sipariş Tarihi</small>
                                        <span className="fw-bold text-dark">{formatDate((item as OrderDtoModel).orderDate)}</span>
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-center text-primary">
                                        <i className="bi bi-truck fs-4 me-2"></i>
                                        <div>
                                          <small className="d-block" style={{ fontSize: "0.7rem" }}>Teslim Tarihi</small>
                                          <span className="fw-bold">{formatDate((item as OrderDtoModel).shippedDate!)}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center text-danger">
                                        <i className="bi bi-calendar-x fs-4 me-2"></i>
                                        <div>
                                          <small className="d-block" style={{ fontSize: "0.7rem" }}>Son Ödeme Tarihi</small>
                                          <span className="fw-bold">{formatDate((item as OrderDtoModel).lines.maturityDate)}</span>
                                        </div>
                                    </div>
                                  </div>

                                  <div className="row g-4">
                                    {/* SİPARİŞ KARTLARI (ÜRÜN VS) */}
                                    <div className="col-md-4">
                                      <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-header bg-white border-bottom fw-bold text-secondary">
                                          <i className="bi bi-basket me-2"></i>Ürün &amp; Fatura Detayı
                                        </div>
                                        <div className="card-body">
                                          <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                              <span className="text-muted">Ürün:</span>
                                              <span className="fw-bold">{(item as OrderDtoModel).lines.productName}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                              <span className="text-muted">Miktar:</span>
                                              <span className="fw-bold">{(item as OrderDtoModel).lines.amount}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                              <span className="text-muted">Birim Fiyat:</span>
                                              <span>{formatNumber((item as OrderDtoModel).lines.unitPrice)} ₺</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between bg-light">
                                              <span className="text-muted">Ara Toplam:</span>
                                              <span className="fw-bold">{formatNumber((item as OrderDtoModel).lines.totalPrice)} ₺</span>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    {/* DÖVİZ KARTLARI */}
                                    <div className="col-md-4">
                                      <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-header bg-white border-bottom fw-bold text-primary">
                                          <i className="bi bi-currency-exchange me-2"></i>Kurlar
                                        </div>
                                        <div className="card-body d-flex flex-column justify-content-center">
                                           <div className="d-flex align-items-center justify-content-between p-2 border rounded mb-2 bg-light">
                                              <span>USD: {formatNumber((item as OrderDtoModel).lines.dolarRate)} ₺</span>
                                           </div>
                                           <div className="d-flex align-items-center justify-content-between p-2 border rounded bg-light">
                                              <span>EUR: {formatNumber((item as OrderDtoModel).lines.euroRate)} ₺</span>
                                           </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* ÖDEME DURUMU KARTI */}
                                    <div className="col-md-4">
                                      <div className="card h-100 border-warning shadow-sm">
                                        <div className="card-header bg-warning bg-opacity-25 border-bottom fw-bold text-dark">
                                          <i className="bi bi-wallet2 me-2"></i>Ödeme Durumu
                                        </div>
                                        <div className="card-body d-flex flex-column justify-content-center">
                                          <div className="mb-3">
                                            <div className="d-flex justify-content-between small mb-1">
                                              <span className="text-muted">İlerleme</span>
                                              <span className="fw-bold">{paymentProgress.toFixed(0)}%</span>
                                            </div>
                                            <div className="progress" style={{ height: "10px" }}>
                                              <div className="progress-bar bg-success" style={{ width: `${paymentProgress}%` }}></div>
                                            </div>
                                          </div>
                                          <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Toplam:</span>
                                            <span className="fw-bold">{formatNumber(totalAmount)} ₺</span>
                                          </div>
                                          <div className="d-flex justify-content-between mb-2">
                                            <span className="text-success">Ödenen:</span>
                                            <span className="fw-bold text-success">{formatNumber(paidAmount)} ₺</span>
                                          </div>
                                          <hr className="my-2" />
                                          <div className="d-flex justify-content-between">
                                            <span className="text-danger fw-bold">Kalan:</span>
                                            <span className="fw-bold text-danger fs-5">{formatNumber(remainingAmount)} ₺</span>
                                          </div>
                                          <Button variant="success" className="mt-3 fw-bold" onClick={(e) => handleOpenPaymentModal(e, item, isOrder)}>
                                            <i className="bi bi-cash-coin me-1"></i> Tahsilat Yap
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                // DEVİR BORÇ DETAYLARI (Daha Sade)
                                <>
                                  <div className="d-flex justify-content-between align-items-center bg-info bg-opacity-10 p-3 rounded mb-4 border border-info">
                                    <div className="d-flex align-items-center text-info">
                                      <i className="bi bi-journal-text fs-4 me-2"></i>
                                      <div>
                                        <span className="fw-bold">Devir Borç / Açılış Bakiyesi Detayı</span>
                                        <small className="d-block text-muted">{description}</small>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row g-4">
                                     <div className="col-md-8">
                                       <div className="card h-100 border-0 shadow-sm">
                                         <div className="card-body">
                                            <h6 className="card-title text-muted">Açıklama</h6>
                                            <p className="card-text">
                                              Bu işlem, müşterinin sisteme dahil edilmeden önceki borç bakiyesini veya manuel eklenen borç kaydını temsil eder.
                                              Herhangi bir sipariş detayı (ürün, miktar vb.) bulunmamaktadır.
                                            </p>
                                         </div>
                                       </div>
                                     </div>
                                     <div className="col-md-4">
                                      <div className="card h-100 border-warning shadow-sm">
                                        <div className="card-header bg-warning bg-opacity-25 border-bottom fw-bold text-dark">
                                          <i className="bi bi-wallet2 me-2"></i>Ödeme Durumu
                                        </div>
                                        <div className="card-body d-flex flex-column justify-content-center">
                                          <div className="mb-3">
                                            <div className="d-flex justify-content-between small mb-1">
                                              <span className="text-muted">İlerleme</span>
                                              <span className="fw-bold">{paymentProgress.toFixed(0)}%</span>
                                            </div>
                                            <div className="progress" style={{ height: "10px" }}>
                                              <div className="progress-bar bg-success" style={{ width: `${paymentProgress}%` }}></div>
                                            </div>
                                          </div>
                                          <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Toplam:</span>
                                            <span className="fw-bold">{formatNumber(totalAmount)} ₺</span>
                                          </div>
                                          <div className="d-flex justify-content-between mb-2">
                                            <span className="text-success">Ödenen:</span>
                                            <span className="fw-bold text-success">{formatNumber(paidAmount)} ₺</span>
                                          </div>
                                          <hr className="my-2" />
                                          <div className="d-flex justify-content-between">
                                            <span className="text-danger fw-bold">Kalan:</span>
                                            <span className="fw-bold text-danger fs-5">{formatNumber(remainingAmount)} ₺</span>
                                          </div>
                                          <Button variant="success" className="mt-3 fw-bold" onClick={(e) => handleOpenPaymentModal(e, item, isOrder)}>
                                            <i className="bi bi-cash-coin me-1"></i> Tahsilat Yap
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

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

      {/* Kısmi Ödeme Modal */}
      <PartialPaymentModal
        show={showPaymentModal}
        handleClose={() => setShowPaymentModal(false)}
        item={selectedItem?.item ?? null}
        isOrder={selectedItem?.isOrder ?? false}
      />
    </>
  );
}

export default PaymentListPage;
