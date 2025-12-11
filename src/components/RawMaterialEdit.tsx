import { useState } from "react";
import { useGetRawMaterialsQuery, useUpdateRawMaterialMutation, useDeleteRawMaterialMutation } from "../services/rawMaterialService";
import type { RawMaterial } from "../models/rawMaterialModel";
import { Button, Modal, Form, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function RawMaterialEdit() {
  const { data: rawmaterials, isLoading, isError } = useGetRawMaterialsQuery();
  const [updateRawMaterial, { isLoading: isUpdating }] = useUpdateRawMaterialMutation();
  const [deleteRawMaterial, { isLoading: isDeleting }] = useDeleteRawMaterialMutation();

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RawMaterial | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleOpenEditModal = (item: RawMaterial) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (item: RawMaterial) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value.toLocaleUpperCase("tr-TR") : value,
    }));
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    if (!formData.name.trim()) {
      toast.error("Ham madde adı zorunludur!");
      return;
    }

    try {
      await updateRawMaterial({
        ...selectedItem,
        name: formData.name,
        description: formData.description,
      }).unwrap();
      toast.success("Ham madde başarıyla güncellendi!");
      setShowEditModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Güncelleme sırasında bir hata oluştu.");
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteRawMaterial(selectedItem.id).unwrap();
      toast.success("Ham madde başarıyla silindi!");
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Silme sırasında bir hata oluştu.");
    }
  };

  if (isLoading) return <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>;
  if (isError) return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-pencil-square me-2"></i>Ham Maddeleri Düzenle
          </h5>
          <Badge bg="light" text="dark">{rawmaterials?.data.length || 0} Kayıt</Badge>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="thead-fistik">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>Ham Madde Adı</th>
                  <th>Açıklama</th>
                  <th className="text-center" style={{ width: "120px" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {rawmaterials && rawmaterials.data.length > 0 ? (
                  rawmaterials.data.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold text-muted">#{item.id}</td>
                      <td className="fw-semibold">{item.name}</td>
                      <td className="text-muted">{item.description || "-"}</td>
                      <td className="text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleOpenEditModal(item)}
                          title="Düzenle"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleOpenDeleteModal(item)}
                          title="Sil"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                      Kayıtlı ham madde bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
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
                autoFocus
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
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={isUpdating}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? (
              <><Spinner animation="border" size="sm" className="me-2" />Kaydediliyor...</>
            ) : (
              <><i className="bi bi-check-lg me-1"></i>Kaydet</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* DELETE MODAL */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2"></i>Ham Madde Sil
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <i className="bi bi-trash text-danger" style={{ fontSize: "3rem" }}></i>
            <h5 className="mt-3">Bu ham maddeyi silmek istediğinize emin misiniz?</h5>
            {selectedItem && (
              <div className="alert alert-secondary mt-3 text-start">
                <p className="mb-1"><strong>ID:</strong> #{selectedItem.id}</p>
                <p className="mb-1"><strong>Ad:</strong> {selectedItem.name}</p>
                <p className="mb-0"><strong>Açıklama:</strong> {selectedItem.description || "-"}</p>
              </div>
            )}
            <p className="text-muted small">Bu işlem geri alınamaz!</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <><Spinner animation="border" size="sm" className="me-2" />Siliniyor...</>
            ) : (
              <><i className="bi bi-trash me-1"></i>Sil</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RawMaterialEdit;
