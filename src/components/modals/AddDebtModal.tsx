import { useState } from "react";
import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAddOpeningBalanceMutation } from "../../services/customerService";
import type { CustomerModel } from "../../models/customerModel";
import "../css/Modal.css";
import "../css/Forms.css";

interface AddDebtModalProps {
  show: boolean;
  handleClose: () => void;
  customer: CustomerModel | null;
}

function AddDebtModal({ show, handleClose, customer }: AddDebtModalProps) {
  const [addOpeningBalance, { isLoading }] = useAddOpeningBalanceMutation();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("Devreden Borç");

  const handleSubmit = async () => {
    if (!customer) return;
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Lütfen geçerli bir tutar giriniz.");
      return;
    }

    try {
      await addOpeningBalance({
        id: 0,
        customerId: customer.id,
        date: new Date().toISOString(),
        amount: numericAmount,
        description: description || "Devreden Borç",
        isDebt: true,
      }).unwrap();
      
      toast.success(`${customer.customerName} için ${numericAmount.toLocaleString("tr-TR")} ₺ devir borç eklendi!`);
      setAmount("");
      setDescription("Devreden Borç");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Devir borç eklenirken bir hata oluştu.");
    }
  };

  const handleModalClose = () => {
    setAmount("");
    setDescription("Devreden Borç");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-cash-stack me-2"></i>
          Devir Borç Ekle
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-info d-flex align-items-center mb-3">
          <i className="bi bi-info-circle-fill fs-5 me-2"></i>
          <div>
            <strong>{customer?.customerName}</strong> için devir borç ekliyorsunuz.
          </div>
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              <i className="bi bi-currency-lira me-1"></i>Tutar
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
                autoFocus
              />
              <InputGroup.Text>₺</InputGroup.Text>
            </InputGroup>
          </Form.Group>

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
          variant="danger"
          onClick={handleSubmit}
          disabled={isLoading || !amount}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" animation="border" className="me-1" />
              Ekleniyor...
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-1"></i>
              Borç Ekle
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddDebtModal;
