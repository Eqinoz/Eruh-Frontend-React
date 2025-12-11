import { formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";
import {
  useDeleteToPackagedItemMutation,
  useGetToPackagedItemsQuery,
} from "../services/toPackagedService";
import { useGetPackagingTypesQuery } from "../services/packagingTypeService";
import type { ToPackagedItem } from "../models/toPackagedModal";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useState } from "react";
import "./css/Modal.css";
import type { ProductModel } from "../models/productModel";
import { toast } from "react-toastify";
import { useAddProductMutation } from "../services/productService";
import ExcelButton from "../common/ExcelButton";

function ToBePackagedList() {
  const { data: processed, isLoading, isError } = useGetToPackagedItemsQuery();
  const { data: packagingTypesResponse, isLoading: isLoadingPackagingTypes } = useGetPackagingTypesQuery();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [deleteToPackagedItem, { isLoading: isDeleting }] =
    useDeleteToPackagedItemMutation();
  const [showModal, setShowModal] = useState(false);
  const [select, setSelect] = useState<ToPackagedItem | null>(null);
  const [packagingType, setPackagingType] = useState<string>("");

  const packagingTypes = packagingTypesResponse?.data || [];

  const handleClose = () => {
    setShowModal(false);
    setSelect(null); // Modal kapandığında 'select'i sıfırla
    setPackagingType(""); // 'packagingType'ı sıfırla
  };

  // 🐞 1. HATA DÜZELTME: 'item: any' yerine doğru tipi kullandım
  const handleShow = (item: ToPackagedItem) => {
    setSelect(item);
    setPackagingType(""); // Modal açılırken input'u temizle
    setShowModal(true);
  };

  //Excel İşlemleri

  const columns = [
    { header: "Cinsi", key: "productType" },
    { header: "Ürün Adı", key: "productName" },
    { header: "Miktarı", key: "amount" },
  ];

  const excelData = processed?.data.map((item) => ({
    productType: item.productType,
    productName: item.productName,
    amount: formatNumber(item.amount),
  })) ?? [];

  const handleprocessComplete = async () => {
    if (!select || !packagingType) {
      toast.error("Lütfen paketleme tipini seçiniz!");
      return;
    }
    try {
      const newProduct: ProductModel = {
        id: 0,
        productId: select.productType, // Bu (DB, DLK)
        name: select.productName,
        amount: select.amount,
        packagingType: packagingType,
      };
      console.log(newProduct);
      await addProduct(newProduct).unwrap();
      await deleteToPackagedItem(select.id!).unwrap();

      toast.success("Paketleme işlemi başarıyla tamamlandı!");
      handleClose();
    } catch (error: any) {
      toast.error(
        error.data?.message || "Paketleme işlemi sırasında bir hata oluştu."
      );
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
            <i className="bi bi-box-seam me-2"></i>Paketlenecek Ürünler
          </h5>
          <ExcelButton 
            data={excelData} 
            columns={columns} 
            fileName="Paketlenecek-Ürünler"
            title="Paketlenecek Ürünler"
            disabled={isLoading} 
          />
        </div>
        <div className="card-body">
          <div className="table-responsive">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="thead-fistik align-items-center">
              <tr>
                <th>ID</th>
                <th>Cinsi (Kodu)</th>
                <th>Adı</th>
                <th>Miktar (kg)</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {processed && processed.data && processed.data.length > 0 ? (
                processed.data.map((p: ToPackagedItem, index: number) => (
                  <tr key={p.id}>
                    <td>{index + 1}</td>
                    <td>{p.productType}</td>
                    <td>{p.productName}</td>
                    <td>{formatNumber(p.amount)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => handleShow(p)}
                      >
                        <i className="bi bi-box-seam me-1"></i>
                        Paketle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* 🐞 3. HATA DÜZELTME: colSpan 6 idi, 5 yaptım */}
                  <td colSpan={5} className="text-center text-muted">
                    Paketlenecek ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="table-group-divider">
              <tr className="total-row-grand">
                {/* 🐞 4. HATA DÜZELTME: colSpan'ı 5'e göre hizaladım */}
                <th colSpan={3} className="text-end">
                  Genel Toplam Miktar:
                </th>
                <th className="text-start">{formatNumber(totalAmount)}</th>
                <th colSpan={1}></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 🐞 5. KRİTİK HATA DÜZELTME: Modal.Body'deki HTML yapısı düzeltildi */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-header-fistik">
          <Modal.Title>Paketleme İşlemi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Şu ürünü paketliyorsunuz:{" "}
            <strong className="modal-product-name">
              {select?.productName}
            </strong>
          </p>
          <p>
            Mevcut Miktar: <strong>{formatNumber(select?.amount)} kg</strong>
          </p>
          <hr />
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <i className="bi bi-box me-2"></i>Paketleme Tipini Seçiniz:
              </Form.Label>
              {isLoadingPackagingTypes ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <span>Paketleme tipleri yükleniyor...</span>
                </div>
              ) : (
                <Form.Select
                  className="mt-2"
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value)}
                  autoFocus
                >
                  <option value="">-- Paketleme Tipi Seçin --</option>
                  {packagingTypes.map((pt) => (
                    <option key={pt.id} value={pt.packagingTypeName}>
                      {pt.packagingTypeName}({pt.amount}KG)
                    </option>
                  ))}
                </Form.Select>
              )}
              {packagingTypes.length === 0 && !isLoadingPackagingTypes && (
                <div className="alert alert-warning mt-2 small">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Henüz paketleme tipi tanımlanmamış. Lütfen Yönetim menüsünden ekleyin.
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* 🐞 6. HATA DÜZELTME: 'İptal' butonu düzeltildi ve tema eklendi */}
          <Button
            variant="secondary"
            className="btn-fistik-secondary"
            onClick={handleClose} // 👈 onClick eklendi
            disabled={isAdding || isDeleting} // 👈 disabled eklendi
          >
            İptal
          </Button>
          <Button
            variant="primary"
            className="btn-fistik-primary" // 👈 Tema eklendi
            onClick={handleprocessComplete}
            disabled={isAdding || isDeleting} // 👈 disabled eklendi
          >
            {isAdding || isDeleting ? "Paketleniyor..." : "Paketle"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ToBePackagedList;
