import { useState } from "react";
import { Button, Card, Form, Modal, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetPackagingTypesQuery,
  useAddPackagingTypeMutation,
  useUpdatePackagingTypeMutation,
  useDeletePackagingTypeMutation,
} from "../services/packagingTypeService";
import type { PackagingTypeModel } from "../models/packagingTypeModel";
import "./css/RawMaterialList.css";

function PackagingTypeList() {
  const { data: packagingTypesResponse, isLoading, isError } = useGetPackagingTypesQuery();
  const [addPackagingType, { isLoading: isAdding }] = useAddPackagingTypeMutation();
  const [updatePackagingType, { isLoading: isUpdating }] = useUpdatePackagingTypeMutation();
  const [deletePackagingType, { isLoading: isDeleting }] = useDeletePackagingTypeMutation();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PackagingTypeModel | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [newCapacity, setNewCapacity] = useState<number>(0);

  const packagingTypes = packagingTypesResponse?.data || [];

  // Add Modal handlers
  const handleShowAddModal = () => {
    setNewTypeName("");
    setNewCapacity(0);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTypeName("");
    setNewCapacity(0);
  };

  const handleAdd = async () => {
    if (!newTypeName.trim()) {
      toast.error("Lütfen paketleme tipi adını giriniz!");
      return;
    }
    try {
      await addPackagingType({ 
        packagingTypeName: newTypeName.trim(),
        amount: newCapacity 
      }).unwrap();
      toast.success("Paketleme tipi başarıyla eklendi!");
      handleCloseAddModal();
    } catch (error: any) {
      toast.error(error.data?.message || "Ekleme sırasında bir hata oluştu.");
    }
  };

  // Edit Modal handlers
  const handleShowEditModal = (item: PackagingTypeModel) => {
    setSelectedItem(item);
    setNewTypeName(item.packagingTypeName);
    setNewCapacity(item.amount);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
    setNewTypeName("");
    setNewCapacity(0);
  };

  const handleUpdate = async () => {
    if (!selectedItem || !newTypeName.trim()) {
      toast.error("Lütfen paketleme tipi adını giriniz!");
      return;
    }
    try {
      await updatePackagingType({
        id: selectedItem.id,
        packagingTypeName: newTypeName.trim(),
        amount: newCapacity,
      }).unwrap();
      toast.success("Paketleme tipi başarıyla güncellendi!");
      handleCloseEditModal();
    } catch (error: any) {
      toast.error(error.data?.message || "Güncelleme sırasında bir hata oluştu.");
    }
  };

  // Delete handler
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" paketleme tipini silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await deletePackagingType(id).unwrap();
      toast.success("Paketleme tipi başarıyla silindi!");
    } catch (error: any) {
      toast.error(error.data?.message || "Silme sırasında bir hata oluştu.");
    }
  };

  if (isLoading) return <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>;
  if (isError) return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  return (
    <>
      <Card className="shadow-lg border-0">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-box me-2"></i>Paketleme Tipleri
          </h5>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="light" text="dark" className="fs-6">
              {packagingTypes.length} Tip
            </Badge>
            <Button
              variant="light"
              size="sm"
              className="d-flex align-items-center"
              onClick={handleShowAddModal}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Yeni Ekle
            </Button>
          </div>
        </div>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="thead-fistik">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>Paketleme Tipi Adı</th>
                  <th>Kapasite(Kg)</th>
                  <th className="text-center" style={{ width: "150px" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {packagingTypes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      Henüz paketleme tipi tanımlanmamış.
                      <br />
                      <Button
                        variant="success"
                        size="sm"
                        className="mt-3"
                        onClick={handleShowAddModal}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        İlk Paketleme Tipini Ekle
                      </Button>
                    </td>
                  </tr>
                ) : (
                  packagingTypes.map((pt, index) => (
                    <tr key={pt.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: 36,
                              height: 36,
                              background: "linear-gradient(135deg, #4a7c59 0%, #6b9b7a 100%)",
                            }}
                          >
                            <i className="bi bi-box text-white"></i>
                          </div>
                          <span className="fw-semibold">{pt.packagingTypeName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{pt.amount}KG</div> </td>
                      <td className="text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowEditModal(pt)}
                          disabled={isUpdating || isDeleting}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(pt.id, pt.packagingTypeName)}
                          disabled={isUpdating || isDeleting}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
        <Modal.Header closeButton className="modal-header-fistik">
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>Yeni Paketleme Tipi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Paketleme Tipi Adı</Form.Label>
              <Form.Control
                type="text"
                placeholder="Örn: Vakumlu, Siyah Kutu, Battal Çuval, Yeşil Kutu"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kapasite(Kg)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Örn: 25KG-10KG-50KG"
                onChange={(e) => setNewCapacity(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal} disabled={isAdding}>
            İptal
          </Button>
          <Button
            variant="success"
            onClick={handleAdd}
            disabled={isAdding || !newTypeName.trim()}
          >
            {isAdding ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Ekleniyor...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-1"></i>
                Ekle
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton className="modal-header-fistik">
          <Modal.Title>
            <i className="bi bi-pencil me-2"></i>Paketleme Tipini Düzenle
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Paketleme Tipi Adı</Form.Label>
              <Form.Control
                type="text"
                placeholder="Örn: Vakumlu, Siyah Kutu, Battal Çuval, Yeşil Kutu"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                autoFocus
              />
              <Form.Label className="fw-bold">Kapasite(Kg)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Örn: 500g , 1kg , 25kg , 1kg "
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal} disabled={isUpdating}>
            İptal
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={isUpdating || !newTypeName.trim()}
          >
            {isUpdating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Güncelleniyor...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-1"></i>
                Güncelle
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PackagingTypeList;
