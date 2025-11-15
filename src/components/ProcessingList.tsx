import { Modal, Button } from "react-bootstrap";
import { useGetProductToProcessedsQuery } from "../services/productToProcessedService";
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css"; // Ana stil
import "./css/Modal.css"; // Modal stilleri
import { toast } from "react-toastify";
import { useDeleteProductToProcessedMutation } from "../services/productToProcessedService"; // 👈 Silme hook'u
import { useAddProcessedProductMutation } from "../services/processedProductService"; // 👈 Ekleme hook'u
import { useState } from "react"; // 👈 State hook'u eklendi
import type { ProductToProcessed } from "../models/productToProcessed"; // 👈 Tipi import ettim

export default function ProcessingList() {
  const { data, isLoading, isError } = useGetProductToProcessedsQuery();

  const [deleteProductToProcessed, { isLoading: isDeleting }] =
    useDeleteProductToProcessedMutation();
  const [addProcessedProduct, { isLoading: isAdding }] =
    useAddProcessedProductMutation();

  // 🎨 4. Onay Modalı için state'ler
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductToProcessed | null>(
    null
  );

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedItem(null);
  };

  const handleShowConfirmModal = (item: ProductToProcessed) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  // 🎨 5. Asıl "İşlemi Tamamla" mantığı
  const handleProcessComplete = async () => {
    if (!selectedItem) return;

    try {
      // Adım 1: Ürünü "İşlenmiş Ürünler" listesine ekle
      // "ProcessedProduct" modeli "inComingFrom" alanı bekliyordu
      const newProcessedProduct = {
        id: 0, // ID'yi backend verecek
        productName: selectedItem.productName,
        description: selectedItem.description,
        amount: selectedItem.amount,
        inComingFrom: "İşlemden Tamamlandı", // Kaynak bilgisi
        dateAdded: new Date().toISOString(),
      };
      await addProcessedProduct(newProcessedProduct).unwrap();

      // Adım 2: Ürünü "İşlemde Olanlar" listesinden (bu listeden) sil
      await deleteProductToProcessed(selectedItem.id).unwrap();

      // Adım 3: Başarı bildirimi ve modalı kapat
      toast.success(
        `"${selectedItem.productName}" başarıyla işlendi ve stoğa eklendi!`
      );
      handleCloseConfirmModal();
    } catch (err: any) {
      console.error("İşlem tamamlanamadı:", err);
      toast.error(err.data?.message || "Bir hata oluştu.");
    }
  };

  // --- Yüklenme ve Hata Durumları (Aynı) ---
  if (isLoading) {
    return <div className="text-center mt-5">Yükleniyor...</div>;
  }
  if (isError) {
    return (
      <div className="alert alert-danger text-center my-3">
        İşleme alınan ürünler yüklenirken hata oluştu.
      </div>
    );
  }

  const items = data?.data ?? [];
  const totalAmount: number = items.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>İşleme Alınan Ürünler
          </h5>
        </div>
        <div className="card-body">
          {items.length === 0 ? (
            <div className="alert alert-info text-center">
              Şu anda işleme alınmış ürün bulunmuyor.
            </div>
          ) : (
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="thead-fistik align-items-center">
                <tr>
                  <th>Ürün</th>
                  <th>Açıklama</th>
                  <th>Miktar (kg)</th>
                  <th>Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.productName}</td>
                    <td className="text-truncate" style={{ maxWidth: 360 }}>
                      {it.description || "(Açıklama yok)"}
                    </td>
                    <td>{formatNumber(it.amount)}</td>
                    <td>{formatDate(it.dateAdded)}</td>
                    <td>
                      {/* 🎨 6. Butonun onClick'ini modalı açacak şekilde güncelledim */}
                      <button
                        className="btn btn-sm btn-success" // Rengi 'success' (yeşil) yaptım
                        onClick={() => handleShowConfirmModal(it)}
                      >
                        <i className="bi bi-check-lg me-1"></i>
                        İşlemi Tamamla
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-group-divider">
                <tr className="total-row-grand">
                  <th colSpan={2} className="text-end">
                    Toplam Miktar:
                  </th>
                  <th className="text-start">{formatNumber(totalAmount)}</th>
                  <th colSpan={2}></th>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* 🎨 7. ONAY MODALI */}
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
        <Modal.Header closeButton className="modal-header-fistik">
          <Modal.Title>İşlemi Onayla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Emin misiniz?{" "}
          <strong className="modal-product-name">
            {selectedItem?.productName}
          </strong>{" "}
          adlı ürün, işlemden çıkarılıp "İşlenmiş Ürünler" stoğuna eklenecek.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn-fistik-secondary"
            onClick={handleCloseConfirmModal}
            disabled={isDeleting || isAdding}
          >
            Hayır, İptal
          </Button>
          <Button
            variant="primary"
            className="btn-fistik-primary"
            onClick={handleProcessComplete}
            disabled={isDeleting || isAdding}
          >
            {isDeleting || isAdding ? "İşleniyor..." : "Evet, Tamamla"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
