import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUpdateOpeningBalanceMutation } from "../../services/customerService";
import type { FinancialTransaction } from "../../models/financialTransactionModel";
import "../css/Modal.css";
import "../css/Forms.css";

interface FinancialTransactionEditModalProps {
  show: boolean;
  handleClose: () => void;
  transaction: FinancialTransaction | null;
  customerId: number;
}

function FinancialTransactionEditModal({
  show,
  handleClose,
  transaction,
  customerId,
}: FinancialTransactionEditModalProps) {
  const [updateTransaction, { isLoading }] = useUpdateOpeningBalanceMutation();

  const [formData, setFormData] = useState({

    date: "",
    amount: 0,
    description: "",
    isDebt: true,
  });

  useEffect(() => {
    if (transaction && show) {
      setFormData({
        date: transaction.date ? transaction.date.split("T")[0] : "",
        amount: transaction.amount,
        description: transaction.description,
        isDebt: transaction.isDebt,
      });
    }
  }, [transaction, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : name === "isDebt" ? value === "true" : value,
    }));
  };

  const handleSubmit = async () => {
    if (!transaction) return;

    if (!formData.description.trim()) {
      toast.error("Lütfen açıklama giriniz!");
      return;
    }

    if (formData.amount <= 0) {
      toast.error("Tutar 0'dan büyük olmalıdır!");
      return;
    }

    try {
      await updateTransaction({
        id: transaction.id,
        customerId: customerId,
        orderId: transaction.orderId,
        date: formData.date,
        amount: formData.amount,
        description: formData.description,
        isDebt: formData.isDebt,
      }).unwrap();
      toast.success("Finansal işlem başarıyla güncellendi!");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-pencil me-2"></i>Finansal İşlemi Düzenle
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Tarih</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Tutar (₺)</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Açıklama</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="İşlem açıklaması"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">İşlem Türü</Form.Label>
            <Form.Select
              name="isDebt"
              value={formData.isDebt.toString()}
              onChange={handleChange}
            >
              <option value="true">Borç</option>
              <option value="false">Ödeme</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          İptal
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-1"></i>Kaydet
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FinancialTransactionEditModal;
