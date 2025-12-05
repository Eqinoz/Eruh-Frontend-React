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
import SendToContractorModal from "./modals/SendToContractorModal";
import ExcelButton from "../common/ExcelButton";

// 🎨 1. Kod çözme fonksiyonu - Kısaltmayı tam açıklamaya çevirir
/**
 * Verilen kodu (örn: "DLXB") alır ve tam açıklamasına çevirir.
 * Örn: "DLXB" -> "Double Lüks Beyaz"
 * Örn: "DK" -> "Double Kırmızı"
 * Mapping: D=Double, LX=Lüks, B=Beyaz, K=Kırmızı, İ=İtal
 */
function generateProductType(code: string): string {
  if (!code) return "";
  
  const upperCode = code.toUpperCase();
  const result: string[] = [];
  let i = 0;
  
  while (i < upperCode.length) {
    // İki karakterli kombinasyonları kontrol et (LX)
    if (i < upperCode.length - 1) {
      const twoChar = upperCode.substring(i, i + 2);
      if (twoChar === "LX") {
        result.push("Lüks");
        i += 2;
        continue;
      }
    }
    
    // Tek karakterli eşleşmeleri kontrol et
    const char = upperCode[i];
    switch (char) {
      case "D":
        result.push("DOUBLE");
        break;
      case "B":
        result.push("BEYAZ");
        break;
      case "K":
        result.push("KIRMIZI");
        break;
      case "İ":
      case "I":
        result.push("İTHAL");
        break;
      default:
        // Bilinmeyen karakter varsa olduğu gibi ekle
        result.push(char);
    }
    i++;
  }
  
  return result.join(" ");
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
  const [showSendModal, setShowSendModal]= useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProcessedProduct | null>(null);
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

  //Excel İşlemleri

  const columns = [
    { header: "Ürün", key: "productName" },
    { header: "Açıklama", key: "description" },
    { header: "Giriş Miktarı", key: "amount" },
    { header: "Tarih", key: "dateAdded" },
  ];

  const excelData = processed?.data.map((item) => ({
    productName: item.productName,
    description: item.description,
    amount: formatNumber(item.amount),
    dateAdded: formatDate(item.dateAdded),
  })) ?? [];

  // 🎨 4. Modal'daki tüm input değişikliklerini yönetecek TEK fonksiyon
  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Eğer değişen input "productType" (Ürün Türü) ise...
    if (name === "productType") {
      const upperValue = value.toLocaleUpperCase("tr-TR");
      const newProductName = generateProductType(upperValue); // Kısaltmayı hesapla
      setSelectedItem((prev) => ({
        ...prev!,
        productName: newProductName, // Ürün adını güncelle
        productType: upperValue, // Ürün türünü de OTOMATİK güncelle
      }));
    } else if(name === "productName"){
      setSelectedItem((prev) => ({
        ...prev!,
        productName: value.toLocaleUpperCase("tr-TR"),
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
      <div className="card shadow-sm">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0">
            <i className="bi bi-box-seam me-2"></i>İşlenmiş Ürünler
          </h5>
          <ExcelButton 
            data={excelData} 
            columns={columns} 
            fileName="İşlenmiş Ürünler"
            title="İşlenmiş Ürünler"
            disabled={isLoading} 
          />
        </div>
        <div className="card-body">
          <div className="table-responsive">
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
                        className="btn btn-sm btn-primary me-2 py-1"
                        onClick={() => handleShowConfirmModal(p)}
                      >
                        <i className="bi bi-box-seam me-1"></i>
                        Paketlemeye Gönder
                      </button>
                      <button className="btn btn-info me-2 py-1"
                      onClick={() => { setSelectedProduct(p); setShowSendModal(true); }}>
                          <i className="bi bi-send me-1"></i>
                          Fasoncuya Gönder
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
            placeholder="Ürün Türünü Giriniz (Örn: DB, DLK)"
            name="productType" // 👈 name eklendi
            value={selectedItem?.productType || ""} // 👈 value eklendi
            onChange={handleModalInputChange} // 👈 onChange güncellendi
          />
          
          <input
            type="text"
            className="form-control mt-3"
            placeholder="Ürün Adını Giriniz"
            name="productName" // 👈 name eklendi
            value={selectedItem?.productName || ""} // 👈 value eklendi
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
      <SendToContractorModal 
    show={showSendModal} 
    handleClose={() => setShowSendModal(false)} 
    product={selectedProduct} 
    sourceType="Fasoncu" // Veya "Komisyoncu"
/>
    </div>
  );
}

export default ProcessedProductList;
