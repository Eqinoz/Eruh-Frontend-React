import { useState } from "react";
import { useGetProcessedProductsQuery, useUpdateProcessedProductMutation, useDeleteProcessedProductMutation } from "../services/processedProductService";
import type { ProcessedProduct } from "../models/processedProductModel";
import { Button, Modal, Form, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "./css/RawMaterialList.css";
import "./css/Modal.css";

function ProcessedProductEdit() {
  const { data, isLoading, isError } = useGetProcessedProductsQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProcessedProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProcessedProductMutation();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProcessedProduct | null>(null);
  const [formData, setFormData] = useState({ productName: "", description: "" });

  const handleOpenEditModal = (item: ProcessedProduct) => {
    setSelectedItem(item);
    setFormData({ productName: item.productName, description: item.description || "" });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (item: ProcessedProduct) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      await updateProduct({ ...selectedItem, productName: formData.productName, description: formData.description }).unwrap();
      toast.success("Ürün başarıyla güncellendi!");
      setShowEditModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Güncelleme sırasında bir hata oluştu.");
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteProduct(selectedItem.id).unwrap();
      toast.success("Ürün başarıyla silindi!");
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
          <h5 className="mb-0"><i className="bi bi-pencil-square me-2"></i>İşlenmiş Ürünleri Düzenle</h5>
          <Badge bg="light" text="dark">{data?.data.length || 0} Kayıt</Badge>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="thead-fistik"><tr><th>ID</th><th>Ürün Adı</th><th>Açıklama</th><th className="text-center">İşlemler</th></tr></thead>
              <tbody>
                {data && data.data.length > 0 ? data.data.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td><td>{item.productName}</td><td>{item.description || "-"}</td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleOpenEditModal(item)}><i className="bi bi-pencil"></i></Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleOpenDeleteModal(item)}><i className="bi bi-trash"></i></Button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={4} className="text-center py-5 text-muted">Kayıt bulunamadı.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="modal-header-fistik"><Modal.Title><i className="bi bi-pencil me-2"></i>Ürün Düzenle</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label className="fw-bold">Ürün Adı</Form.Label><Form.Control type="text" name="productName" value={formData.productName} onChange={handleChange} autoFocus /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="fw-bold">Açıklama</Form.Label><Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={isUpdating}>İptal</Button>
          <Button variant="primary" onClick={handleUpdate} disabled={isUpdating}>{isUpdating ? "Kaydediliyor..." : "Kaydet"}</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white"><Modal.Title><i className="bi bi-exclamation-triangle me-2"></i>Ürün Sil</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <i className="bi bi-trash text-danger" style={{ fontSize: "3rem" }}></i>
            <h5 className="mt-3">Bu ürünü silmek istediğinize emin misiniz?</h5>
            {selectedItem && <div className="alert alert-secondary mt-3"><strong>{selectedItem.productName}</strong></div>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>İptal</Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Siliniyor..." : "Sil"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProcessedProductEdit;
