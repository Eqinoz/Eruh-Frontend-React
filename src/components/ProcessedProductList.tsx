import {
  useDeleteProcessedProductMutation,
  useGetProcessedProductsQuery,
} from "../services/processedProductService";
import type { ProcessedProduct } from "../models/processedProductModel";
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";
import { Button, Modal } from "react-bootstrap";
import { useAddToPackagedItemMutation } from "../services/toPackagedService";
import { useState } from "react";
import type { ToPackagedItem } from "../models/toPackagedModal";
import { toast } from "react-toastify";
import "./css/Modal.css"; // Modal stillerini de import ettim

// 🎨 1. Kısaltma fonksiyonunu component'in dışına (veya bir utils dosyasına) ekle
/**
 * Verilen ürün adını alır ve baş harflerine göre kısaltır.
 * Örn: "Duble Beyaz" -> "DB"
 * Örn: "Duble Lüks Kırmızı" -> "DLK" (X'i atar)
 */
function generateProductType(name: string): string {
  if (!name) return "";
  // Kelimelere ayır, 'X' gibi bağlaçları/istenmeyenleri filtrele (opsiyonel)
  const words = name
    .split(" ")
    .filter((word) => word.length > 1 || word.toLowerCase() === "x");
  // Baş harfleri al, birleştir ve büyük harf yap
  return words
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function ProcessedProductList() {
  const {
    data: processed,
    isLoading,
    isError,
  } = useGetProcessedProductsQuery();
  const [deleteProcessedProduct, { isLoading: isDeleting }] =
    useDeleteProcessedProductMutation();
  const [addToPackagedItem, { isLoading: isAdding }] =
    useAddToPackagedItemMutation();

  // 🎨 2. 'selectedItem' state'inin tipini daha net belirledim
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (Partial<ToPackagedItem> & { originalId: number }) | null
  >(null);

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedItem(null);
  };

  const handleShowConfirmModal = (item: ProcessedProduct) => {
    // 🎨 3. Modal açılırken state'i doldur
    setSelectedItem({
      originalId: item.id, // Orijinal ID'yi silmek için sakla
      productType: "", // Ürün türü başlangıçta boş
      productName: item.productName,
      amount: item.amount,
      id: 0, // Yeni kaydın ID'si 0 olacak
    });
    setShowConfirmModal(true);
  };

  // 🎨 4. Modal'daki tüm input değişikliklerini yönetecek TEK fonksiyon
  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Eğer değişen input "productName" (Ürün Adı) ise...
    if (name === "productName") {
      const newProductType = generateProductType(value); // Kısaltmayı hesapla
      setSelectedItem((prev) => ({
        ...prev!,
        productName: value, // Ürün adını güncelle
        productType: newProductType, // Ürün türünü de OTOMATİK güncelle
      }));
    }
    // Eğer değişen input "amount" (Miktar) ise...
    else if (name === "amount") {
      setSelectedItem((prev) => ({
        ...prev!,
        amount: Number(value) || 0, // Sayıya çevir
      }));
    }
    // Eğer değişen input "productType" (Ürün Türü) ise...
    // (Kullanıcının manuel düzeltmesine izin ver)
    else if (name === "productType") {
      setSelectedItem((prev) => ({
        ...prev!,
        productType: value,
      }));
    }
  };

  const handleProcessComplete = async () => {
    if (
      !selectedItem ||
      !selectedItem.productType ||
      !selectedItem.productName ||
      !selectedItem.amount
    ) {
      toast.error("Lütfen tüm alanları (Ürün Türü, Adı, Miktar) doldurun.");
      return;
    }

    try {
      // Adım 1: "Paketlenmeye" gönderilecek yeni objeyi oluştur
      const newToPackaged: ToPackagedItem = {
        id: 0,
        productType: selectedItem.productType!,
        productName: selectedItem.productName!,
        amount: selectedItem.amount!,
      };
      await addToPackagedItem(newToPackaged).unwrap();

      // Adım 2: Eski kaydı "İşlenmiş Ürünler" listesinden sil
      await deleteProcessedProduct(selectedItem.originalId!).unwrap();

      toast.success(
        `"${selectedItem.productName}" başarıyla paketlemeye gönderildi!`
      );
      handleCloseConfirmModal();
    } catch (err: any) {
      console.error("İşlem tamamlanamadı:", err);
      toast.error(err.data?.message || "Bir hata oluştu.");
    }
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const totalAmount: number = processed
    ? processed.data.reduce((sum, p) => sum + p.amount, 0)
    : 0;

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0">
            <i className="bi bi-box-seam me-2"></i>İşlenmiş Ürünler
          </h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="thead-fistik align-items-center">
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Açıklama</th>
                <th>Miktar (kg)</th>
                <th>Kaynak</th>
                <th>Stoğa Eklendiği Tarih</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {processed && processed.data && processed.data.length > 0 ? (
                processed.data.map((p: ProcessedProduct) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.productName}</td>
                    <td>{p.description}</td>
                    <td>{formatNumber(p.amount)}</td>
                    <td>{p.inComingFrom}</td>
                    <td>{formatDate(p.dateAdded)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleShowConfirmModal(p)}
                      >
                        <i className="bi bi-box-seam me-1"></i>
                        Paketlemeye Gönder
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    {" "}
                    {/* 🐞 Colspan'ı 7 yaptım */}
                    İşlenmiş ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="table-group-divider">
              <tr className="total-row-grand">
                <th colSpan={3} className="text-end">
                  Genel Toplam Miktar:
                </th>
                <th className="text-start">{formatNumber(totalAmount)}</th>
                <th colSpan={3}></th> {/* 🐞 Colspan'ı 3 yaptım */}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 🎨 7. ONAY MODALI (Güncellendi) */}
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
        <Modal.Header closeButton className="modal-header-fistik">
          <Modal.Title>Paketlemeye Gönder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bu ürünü ("{selectedItem?.productName}") paketlemeye göndermek için
          lütfen bilgileri onaylayın veya düzenleyin.
          {/* 🎨 5. INPUT'LAR GÜNCELLENDİ */}
          <input
            type="text"
            className="form-control mt-3"
            placeholder="Ürün Adını Giriniz"
            name="productName" // 👈 name eklendi
            value={selectedItem?.productName || ""} // 👈 value eklendi
            onChange={handleModalInputChange} // 👈 onChange güncellendi
          />
          <input
            type="text"
            className="form-control mt-3"
            placeholder="Ürün Türünü Giriniz (Örn: DB, DLK)"
            name="productType" // 👈 name eklendi
            value={selectedItem?.productType || ""} // 👈 value eklendi
            onChange={handleModalInputChange} // 👈 onChange güncellendi
          />
          <input
            type="number"
            className="form-control mt-3"
            placeholder="Miktarı Giriniz"
            name="amount" // 👈 name eklendi
            value={selectedItem?.amount || 0} // 👈 value eklendi
            onChange={handleModalInputChange} // 👈 onChange güncellendi
          />
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
            {isDeleting || isAdding ? "İşleniyor..." : "Paketlemeye Gönder"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProcessedProductList;
