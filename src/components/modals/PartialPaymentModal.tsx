import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCompletePaymentMutation } from "../../services/orderService";
import { usePayOpeningBalanceMutation } from "../../services/customerService";
import type { OrderDtoModel } from "../../models/orderDtoModel";
import type { OpeningBalanceDetail } from "../../models/financialTransactionModel";
import { formatNumber } from "../../utilities/formatters";
import "../css/Modal.css";
import "../css/Forms.css";

// PaymentItem union type: Ya Sipariş ya da Devir Borç
type PaymentItem = OrderDtoModel | OpeningBalanceDetail;

interface PartialPaymentModalProps {
  show: boolean;
  handleClose: () => void;
  item: PaymentItem | null;
  isOrder: boolean; // true = Sipariş, false = Devir Borç
}

function PartialPaymentModal({ show, handleClose, item, isOrder }: PartialPaymentModalProps) {
  // Mutation'lar
  const [payOrder, { isLoading: isOrderLoading }] = useCompletePaymentMutation();
  const [payOpening, { isLoading: isOpeningLoading }] = usePayOpeningBalanceMutation();

  const isLoading = isOrderLoading || isOpeningLoading;

  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // İlgili alanları normalize et (Sipariş ve Devir Borç modelleri arasında farklar olabilir)
  // Casting yaparak erişiyoruz
  const remainingAmount = item 
    ? (isOrder ? (item as OrderDtoModel).remainingAmount : (item as OpeningBalanceDetail).remainingAmount) 
    : 0;
  
  const paidAmount = item 
    ? (isOrder ? (item as OrderDtoModel).paidAmount : (item as OpeningBalanceDetail).paidAmount) 
    : 0;
  
  const totalAmount = item 
    ? (isOrder ? (item as OrderDtoModel).totalOrderAmount : (item as OpeningBalanceDetail).totalDevirAmount) 
    : 0;
  
  const customerName = item?.customerName;
  const itemName = item 
    ? (isOrder ? (item as OrderDtoModel).lines.productName : (item as OpeningBalanceDetail).description)
    : "";

  // Modal açıldığında form reset
  useEffect(() => {
    if (item && show) {
      setAmount(remainingAmount.toString());
      setDescription("");
    }
  }, [item, show, remainingAmount]);

  const handleSubmit = async () => {
    if (!item) return;
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Lütfen geçerli bir tutar giriniz.");
      return;
    }

    if (numericAmount > remainingAmount) {
      toast.error("Girilen tutar, kalan borçtan fazla olamaz!");
      return;
    }

    try {
      if (isOrder) {
         // Sipariş Ödemesi
         await payOrder({
          orderId: item.id,
          amount: numericAmount,
          description: description || `Sipariş #${item.id} ödemesi`,
          isDebt: false,
        }).unwrap();
      } else {
        // Devir Borç Ödemesi
        await payOpening({
           // item.id burada OpeningBalanceDetail'in ID'si (muhtemelen customerId değil transactionId)
           // Ancak kullanıcı veriye göre "id": 3, "customerName": "GROSS PERVARİ"
           // Genellikle bu tür endpointler CustomerId ile işlem yapar.
           // Backend'in beklediği parametre: PayOpeningBalanceRequest { customerId, amount, description }
           // Burada item.id (3) Müşteri ID'si mi? Evet, JSON örneğinde id:3 ve customerName yazıyor.
           // O yüzden item.id'yi customerId olarak gönderiyoruz.
          customerId: item.id, 
          amount: numericAmount,
          description: description || `Devir Borç Ödemesi`,
        }).unwrap();
      }
      
      const isFullPayment = numericAmount >= remainingAmount;
      toast.success(
        isFullPayment
          ? `${customerName || 'İşlem'} için tam tahsilat yapıldı! 💸`
          : `${customerName || 'İşlem'} için ${formatNumber(numericAmount)} ₺ tahsil edildi!`
      );
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Tahsilat işlemi başarısız oldu.");
    }
  };

  const handleModalClose = () => {
    setAmount("");
    setDescription("");
    handleClose();
  };

  const inputAmount = parseFloat(amount) || 0;
  const newRemaining = remainingAmount - inputAmount;

  return (
    <Modal show={show} onHide={handleModalClose} centered size="lg">
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-cash-coin me-2"></i>
          Tahsilat Yap - {isOrder ? `Sipariş #${item?.id}` : 'Devir Bakiye'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Müşteri ve İşlem Bilgisi */}
        <div className="alert alert-secondary d-flex align-items-center mb-3">
          <i className={`bi ${isOrder ? 'bi-box-seam' : 'bi-journal-text'} fs-4 me-2`}></i>
          <div>
            <strong>{customerName}</strong>
            <span className="text-muted ms-2">• {itemName}</span>
          </div>
        </div>

        {/* Tutar Özeti Kartları */}
        <div className="row g-2 mb-4">
          <div className="col-4">
            <div className="border rounded p-2 text-center bg-light">
              <small className="text-muted d-block">Toplam Tutar</small>
              <span className="fw-bold text-dark">{formatNumber(totalAmount)} ₺</span>
            </div>
          </div>
          <div className="col-4">
            <div className="border rounded p-2 text-center bg-success bg-opacity-10">
              <small className="text-success d-block">Ödenen</small>
              <span className="fw-bold text-success">{formatNumber(paidAmount)} ₺</span>
            </div>
          </div>
          <div className="col-4">
            <div className="border rounded p-2 text-center bg-danger bg-opacity-10">
              <small className="text-danger d-block">Kalan Borç</small>
              <span className="fw-bold text-danger">{formatNumber(remainingAmount)} ₺</span>
            </div>
          </div>
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              <i className="bi bi-currency-lira me-1"></i>Tahsil Edilecek Tutar
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max={remainingAmount}
                step="0.01"
                required
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (amount && inputAmount > 0 && inputAmount <= remainingAmount) {
                      handleSubmit();
                    }
                  }
                }}
              />
              <InputGroup.Text>₺</InputGroup.Text>
            </InputGroup>
            <Form.Text className="text-muted">
              Maksimum: {formatNumber(remainingAmount)} ₺
            </Form.Text>
          </Form.Group>

          {/* Hızlı Tutar Butonları */}
          <div className="d-flex gap-2 mb-3">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setAmount(remainingAmount.toString())}
            >
              Tamamını Öde
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setAmount((remainingAmount / 2).toFixed(2))}
            >
              Yarısını Öde
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setAmount((remainingAmount / 4).toFixed(2))}
            >
              1/4 Öde
            </Button>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              <i className="bi bi-card-text me-1"></i>Açıklama
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Açıklama (opsiyonel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* Hesaplama Önizleme */}
          {inputAmount > 0 && (
            <div className="alert alert-info py-2">
              <div className="d-flex justify-content-between">
                <span>Bu ödeme sonrası kalan borç:</span>
                <strong className={newRemaining <= 0 ? "text-success" : "text-warning"}>
                  {newRemaining <= 0 ? "0.00" : formatNumber(newRemaining)} ₺
                  {newRemaining <= 0 && <i className="bi bi-check-circle-fill ms-1"></i>}
                </strong>
              </div>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="btn-fistik-secondary"
          onClick={handleModalClose}
          disabled={isLoading}
        >
          İptal
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={isLoading || !amount || inputAmount <= 0 || inputAmount > remainingAmount}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" animation="border" className="me-1" />
              İşleniyor...
            </>
          ) : (
            <>
              <i className="bi bi-cash-coin me-1"></i>
              {inputAmount >= remainingAmount ? "Tam Tahsil Et" : "Kısmi Tahsil Et"}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PartialPaymentModal;
