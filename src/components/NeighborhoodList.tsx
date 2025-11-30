import { useGetNeighborhoodsQuery } from "../services/neighborhoodService";
import { useState } from "react";
import type { Neighborhood } from "../models/neigborhoodModel";
import { formatDate, formatNumber } from "../utilities/formatters";
import NeighborhoodProcessModal from "./modals/NeighborhoodProcessModal";

// 🎨 1. Stil dosyamızı import ediyoruz (diğerleriyle aynı)
import "./css/RawMaterialList.css";
import ExcelButton from "../common/ExcelButton";

function NeighborhoodList() {
  const {
    data: neighborhoods,
    isLoading,
    isError,
  } = useGetNeighborhoodsQuery();

  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<Neighborhood | null>(null);

  //Excel İşlemleri

  const columns = [
    { header: "Ürün Tipi", key: "productType" },
    { header: "Adı", key: "productName" },
    { header: "Açıklama", key: "productDescription" },
    { header: "Miktar", key: "amount" },
    { header: "Gönderilme Tarihi", key: "dateOfArrival" },
  ];

  const excelData = neighborhoods?.data.map((item) => ({
    productType: item.productType,
    productName: item.productName,
    productDescription: item.productDescription,
    amount: formatNumber(item.amount),
    dateOfArrival: formatDate(item.dateOfArrival),
  })) ?? [];

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const totalAmount: number = neighborhoods
    ? neighborhoods.data.reduce((sum, n) => sum + n.amount, 0)
    : 0;

  return (
    // 🎨 2. Layout'u 'container-fluid' olarak güncelledim
      <div className="card shadow-sm">
        {/* 🎨 3. Kart başlığını temamıza uygun hale getirdim ve ikon ekledim */}
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0">
            <i className="bi bi-shop me-2"></i>Mahalle Ürünleri
          </h5>
          <ExcelButton 
            data={excelData} 
            columns={columns} 
            fileName="Mahalle-Ürünleri"
            title="Mahalledeki Ürünler"
            disabled={isLoading} 
          />
        </div>
        <div className="card-body">
          <div className="table-responsive">
          <table className="table table-striped table-hover text-center align-middle">
            {/* 🎨 4. Tablo başlığını temamıza uygun hale getirdim */}
            <thead className="thead-fistik align-items-center">
              <tr>
                <th>ID</th>
                <th>Ürün Tipi</th>
                <th>Adı</th>
                <th>Açıklama</th>
                <th>Miktar (kg)</th>
                <th>Gönderilme Tarihi</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {neighborhoods &&
              neighborhoods.data &&
              neighborhoods.data.length > 0 ? (
                neighborhoods.data.map((n: Neighborhood) => (
                  <tr key={n.id}>
                    <td>{n.id}</td>
                    <td>{n.productType}</td>
                    <td>{n.productName}</td>
                    <td>{n.productDescription}</td>
                    <td>{formatNumber(n.amount)}</td>
                    <td>{formatDate(n.dateOfArrival)}</td>
                    <td>
                      {/* 🎨 5. Butona ikon ekledim */}
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setSelectedNeighborhood(n);
                          setShowProcessModal(true);
                        }}
                      >
                        <i className="bi bi-check-lg me-1"></i>
                        İşlemi Tamamla
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* 🐞 6. BUG DÜZELTME: colSpan 5 idi, 7 yaptım */}
                  <td colSpan={7} className="text-center text-muted">
                    Mahalle ürünü bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
            {/* 🐞 7. BUG DÜZELTME: tfoot'u tamamen yeniden hizaladım */}
            <tfoot className="table-group-divider">
              <tr className="total-row-grand">
                {/* Toplam başlığı sağa yaslı (4 sütun kaplar) */}
                <th colSpan={4} className="text-end">
                  Genel Toplam Miktar:
                </th>
                {/* Toplam değer sola yaslı (1 sütun kaplar) */}
                <th className="text-start">{formatNumber(totalAmount)}</th>
                {/* Kalan 2 sütun boş */}
                <th colSpan={2}></th>
              </tr>
            </tfoot>
          </table>
          </div>
          {/* Process modal */}
          <NeighborhoodProcessModal
            show={showProcessModal}
            handleClose={() => {
              setShowProcessModal(false);
              setSelectedNeighborhood(null);
            }}
            neighborhood={selectedNeighborhood}
          />
        </div>
      </div>
  );
}

export default NeighborhoodList;
