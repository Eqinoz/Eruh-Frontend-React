import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUpdateRawMaterialMutation, useDeleteRawMaterialMutation } from "../../services/rawMaterialService";
import type { RawMaterial } from "../../models/rawMaterialModel";
import "../css/Modal.css";
import "../css/Forms.css";

interface RawMaterialEditModalProps {
  show: boolean;
  handleClose: () => void;
  item: RawMaterial | null;
}

function RawMaterialEditModal({ show, handleClose, item }: RawMaterialEditModalProps) {
  const [updateRawMaterial, { isLoading }] = useUpdateRawMaterialMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (item && show) {
      setFormData({
        name: item.name,
        description: item.description || "",
      });
    }
  }, [item, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!item) return;

    if (!formData.name.trim()) {
      toast.error("Ham madde adı zorunludur!");
      return;
    }

    try {
      await updateRawMaterial({
        ...item,
        name: formData.name,
        description: formData.description,
      }).unwrap();
      toast.success("Ham madde başarıyla güncellendi!");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-pencil me-2"></i>Ham Madde Düzenle
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Ham Madde Adı</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          İptal
        </Button>
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

interface RawMaterialDeleteModalProps {
  show: boolean;
  handleClose: () => void;
  item: RawMaterial | null;
}

function RawMaterialDeleteModal({ show, handleClose, item }: RawMaterialDeleteModalProps) {
  const [deleteRawMaterial, { isLoading }] = useDeleteRawMaterialMutation();

  const handleDelete = async () => {
    if (!item) return;

    try {
      await deleteRawMaterial(item.id).unwrap();
      toast.success("Ham madde başarıyla silindi!");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Silme sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <i className="bi bi-exclamation-triangle me-2"></i>Ham Madde Sil
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-3">
          <i className="bi bi-trash text-danger" style={{ fontSize: "3rem" }}></i>
          <h5 className="mt-3">Bu ham maddeyi silmek istediğinize emin misiniz?</h5>
          {item && (
            <div className="alert alert-secondary mt-3 text-start">
              <p className="mb-1"><strong>Ad:</strong> {item.name}</p>
              <p className="mb-0"><strong>Açıklama:</strong> {item.description || "-"}</p>
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

export { RawMaterialEditModal, RawMaterialDeleteModal };
