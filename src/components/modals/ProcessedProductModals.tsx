import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUpdateProcessedProductMutation, useDeleteProcessedProductMutation } from "../../services/processedProductService";
import type { ProcessedProduct } from "../../models/processedProductModel";
import { formatNumber } from "../../utilities/formatters";
import "../css/Modal.css";
import "../css/Forms.css";

interface ProcessedProductEditModalProps {
  show: boolean;
  handleClose: () => void;
  item: ProcessedProduct | null;
}

function ProcessedProductEditModal({ show, handleClose, item }: ProcessedProductEditModalProps) {
  const [updateProduct, { isLoading }] = useUpdateProcessedProductMutation();

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    amount: 0,
    inComingFrom: "",
  });

  useEffect(() => {
    if (item && show) {
      setFormData({
        productName: item.productName,
        description: item.description || "",
        amount: item.amount,
        inComingFrom: item.inComingFrom || "",
      });
    }
  }, [item, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    if (!item) return;

    if (!formData.productName.trim()) {
      toast.error("Ürün adı zorunludur!");
      return;
    }

    try {
      await updateProduct({
        ...item,
        productName: formData.productName,
        description: formData.description,
        amount: formData.amount,
        inComingFrom: formData.inComingFrom,
      }).unwrap();
      toast.success("İşlenmiş ürün başarıyla güncellendi!");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-pencil me-2"></i>İşlenmiş Ürün Düzenle
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Ürün Adı</Form.Label>
            <Form.Control
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Açıklama</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Miktar (kg)</Form.Label>
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
            <Form.Label className="fw-bold">Kaynak</Form.Label>
            <Form.Control
              type="text"
              name="inComingFrom"
              value={formData.inComingFrom}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>İptal</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <><Spinner animation="border" size="sm" className="me-2" />Kaydediliyor...</>
          ) : (
            <><i className="bi bi-check-lg me-1"></i>Kaydet</>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

interface ProcessedProductDeleteModalProps {
  show: boolean;
  handleClose: () => void;
  item: ProcessedProduct | null;
}

function ProcessedProductDeleteModal({ show, handleClose, item }: ProcessedProductDeleteModalProps) {
  const [deleteProduct, { isLoading }] = useDeleteProcessedProductMutation();

  const handleDelete = async () => {
    if (!item) return;

    try {
      await deleteProduct(item.id).unwrap();
      toast.success("İşlenmiş ürün başarıyla silindi!");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Silme sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <i className="bi bi-exclamation-triangle me-2"></i>İşlenmiş Ürün Sil
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-3">
          <i className="bi bi-trash text-danger" style={{ fontSize: "3rem" }}></i>
          <h5 className="mt-3">Bu ürünü silmek istediğinize emin misiniz?</h5>
          {item && (
            <div className="alert alert-secondary mt-3 text-start">
              <p className="mb-1"><strong>Ürün:</strong> {item.productName}</p>
              <p className="mb-0"><strong>Miktar:</strong> {formatNumber(item.amount)} kg</p>
            </div>
          )}
          <p className="text-muted small">Bu işlem geri alınamaz!</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>İptal</Button>
        <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? (
            <><Spinner animation="border" size="sm" className="me-2" />Siliniyor...</>
          ) : (
            <><i className="bi bi-trash me-1"></i>Sil</>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { ProcessedProductEditModal, ProcessedProductDeleteModal };
