import { Modal, Button, Form } from "react-bootstrap";
import { useGetProductToProcessedsQuery } from "../services/productToProcessedService";
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";
import "./css/Modal.css";
import { toast } from "react-toastify";
import { useDeleteProductToProcessedMutation } from "../services/productToProcessedService";
import { useAddProcessedProductMutation } from "../services/processedProductService";
import { useState } from "react";
import type { ProductToProcessed } from "../models/productToProcessed";

export default function ProcessingList() {
  const { data, isLoading, isError } = useGetProductToProcessedsQuery();

  const [deleteProductToProcessed, { isLoading: isDeleting }] = useDeleteProductToProcessedMutation();
  const [addProcessedProduct, { isLoading: isAdding }] = useAddProcessedProductMutation();

  // 🎨 State'ler: Ürün Adı ve Yeni Miktar
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductToProcessed | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductAmount, setNewProductAmount] = useState<number>(0); // 👈 Yeni miktar state'i

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedItem(null);
    setNewProductName("");
    setNewProductAmount(0);
  };

  const handleShowConfirmModal = (item: ProductToProcessed) => {
    setSelectedItem(item);
    setNewProductName(item.productName); // Varsayılan isim
    setNewProductAmount(item.amount);    // Varsayılan miktar (Giriş miktarı)
    setShowConfirmModal(true);
  };

  const handleProcessComplete = async () => {
    if (!selectedItem) return;

    // 🛡️ Basit Doğrulama
    if (newProductAmount <= 0) {
        toast.warn("Lütfen geçerli bir miktar girin.");
        return;
    }

    try {
      // Adım 1: "İşlenmiş Ürünler"e ekle (YENİ MİKTARLA)
      const newProcessedProduct = {
        id: 0,
        productName: newProductName.trim() || selectedItem.productName,
        description: selectedItem.description,
        amount: newProductAmount, // 👈 Kullanıcının girdiği son miktar
        inComingFrom: "İşlemden Tamamlandı",
        dateAdded: new Date().toISOString(),
      };
      await addProcessedProduct(newProcessedProduct).unwrap();

      // Adım 2: Eski kaydı sil
      await deleteProductToProcessed(selectedItem.id).unwrap();

      toast.success(`"${newProductName}" (${newProductAmount} kg) başarıyla stoğa eklendi!`);
      handleCloseConfirmModal();
    } catch (err: any) {
      console.error("İşlem tamamlanamadı:", err);
      toast.error(err.data?.message || "Bir hata oluştu.");
    }
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError) return <div className="alert alert-danger text-center my-3">Hata oluştu.</div>;

  const items = data?.data ?? [];
  const totalAmount = items.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>İşleme Alınan Ürünler</h5>
        </div>
        <div className="card-body">
          {items.length === 0 ? (
            <div className="alert alert-info text-center">Şu anda işleme alınmış ürün bulunmuyor.</div>
          ) : (
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="thead-fistik align-items-center">
                <tr>
                  <th>Ürün</th>
                  <th>Açıklama</th>
                  <th>Giriş Miktarı (kg)</th>
                  <th>Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.productName}</td>
                    <td className="text-truncate" style={{ maxWidth: 360 }}>{it.description || "-"}</td>
                    <td>{formatNumber(it.amount)}</td>
                    <td>{formatDate(it.dateAdded)}</td>
                    <td>
                      <button className="btn btn-sm btn-success" onClick={() => handleShowConfirmModal(it)}>
                        <i className="bi bi-check-lg me-1"></i>İşlemi Tamamla
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-group-divider">
                <tr className="total-row-grand">
                  <th colSpan={2} className="text-end">Toplam Giriş Miktarı:</th>
                  <th className="text-start">{formatNumber(totalAmount)}</th>
                  <th colSpan={2}></th>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* 🎨 GÜNCELLENMİŞ MODAL */}
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
        <Modal.Header closeButton className="modal-header-fistik">
          <Modal.Title>İşlemi Tamamla & Stok Girişi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-light border-success mb-3">
             <small className="text-muted d-block">İşleme Giren Ürün:</small>
             <strong>{selectedItem?.productName}</strong> ({formatNumber(selectedItem?.amount)} kg)
          </div>
          
          <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Çıkan Ürün İsmi</Form.Label>
                <Form.Control
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Ürün ismini girin"
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Çıkan Net Miktar (kg)</Form.Label>
                <Form.Control
                  type="number"
                  value={newProductAmount}
                  onChange={(e) => setNewProductAmount(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                />
                <Form.Text className="text-muted">
                   * Fire düşüldükten sonraki net miktar.
                </Form.Text>
              </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn-fistik-secondary" onClick={handleCloseConfirmModal} disabled={isDeleting || isAdding}>
            İptal
          </Button>
          <Button variant="primary" className="btn-fistik-primary" onClick={handleProcessComplete} disabled={isDeleting || isAdding}>
            {isDeleting || isAdding ? "Kaydediliyor..." : "Kaydet ve Tamamla"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}