import { useState } from "react";
import { useGetProductsQuery } from "../services/productService";
import { formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css"; // Diğerleriyle aynı stili kullanacak

import SendToContractorModal from "./modals/SendToContractorModal";
import type { ProductModel } from "../models/productModel";
import ExcelButton from "../common/ExcelButton";
function ProductListPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  const [showSendModal, setShowSendModal]= useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);

  //Excel İŞLEMLERİ
  const columns = [
    { header: "No.", key: "id" },
    { header: "Ürün ID", key: "productId" },
    { header: "Ürün Adı", key: "productName" },
    { header: "Miktar", key: "amount" },
    { header: "Paketleme Şekli", key: "packagingType" },
  ];

  const excelData = products?.data.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.name,
    amount: formatNumber(item.amount),
    packagingType: item.packagingType,
  })) ?? [];

  if (isLoading) {
    return <div className="text-center mt-5">Yükleniyor...</div>;
  }
  if (isError) {
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;
  }

  let totalAmount: number = 0;
  if (products) {
    totalAmount = products.data.reduce((sum, p) => sum + p.amount, 0);
  }

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-bag-check-fill me-2"></i>Satışa Hazır Ürün
            Listesi
          </h5>
          <ExcelButton 
            data={excelData} 
            columns={columns} 
            fileName="Satışa-Hazır-Ürünler"
            title="Satışa Hazır Ürünler"
            disabled={isLoading} 
          />
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="thead-fistik">
              <tr>
                <th>No.</th>
                <th>Ürün ID</th>
                <th>Adı</th>
                <th>Miktar (kg)</th>
                <th>Paketleme Şekli</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products && products.data.length > 0 ? (
                products.data.map((p, index) => (
                  <tr key={p.productId}>
                    <td>{p.id}</td> 
                    <td>{p.productId}</td>
                    <td>{p.name}</td>
                    <td>{formatNumber(p.amount)}</td>
                    <td>{p.packagingType}</td>
                    <td>
                      <button className="btn btn-info me-2 py-1"
                      onClick={() => { setSelectedProduct(p); setShowSendModal(true); }}>
                          <i className="bi bi-send me-1"></i>
                          Komisyoncuya Gönder
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    Ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="table-group-divider">
              <tr className="total-row-grand">
                <th colSpan={4} className="text-end">
                  Genel Toplam Miktar:
                </th>
                <th className="text-start">{formatNumber(totalAmount)}</th>
                <th colSpan={1}></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <SendToContractorModal 
    show={showSendModal} 
    handleClose={() => setShowSendModal(false)} 
    product={selectedProduct} 
    sourceType="Komisyoncu" // Veya "Komisyoncu"
/>
    </div>
  );
  
}
export default ProductListPage;
