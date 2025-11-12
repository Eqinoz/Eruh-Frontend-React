// RawMaterialList.tsx

import { useGetRawMaterialsQuery } from "../services/rawMaterialService";
import NeighborhoodSendModal from "./modals/NeighborhoodModal";
import RawMaterialToProcessedModal from "./modals/RawMaterialToProcessedModal";
import { useState } from "react";
import type { RawMaterial } from "../models/rawMaterialModel";
import { formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css"; // 👈 Yeni CSS'i import ediyoruz

function RawMaterialList() {
  const { data: rawmaterials, isLoading, isError } = useGetRawMaterialsQuery();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<RawMaterial | null>(
    null
  );
  const [showProcessedModal, setShowProcessedModal] = useState(false);
  const [selectedForProcessed, setSelectedForProcessed] =
    useState<RawMaterial | null>(null);

  // ⭐️ KOD TEMİZLİĞİ 1:
  // Backend'den gelen tutarsız veriyi (neighborhoodIncomingAmount vs neighborhoodInComingAmount)
  // temizlemek için bir yardımcı fonksiyon.
  const getNeighborhoodStock = (item: RawMaterial): number => {
    const p = item as any; // Tipi 'any' olarak alıyoruz (backend hatası yüzünden)
    return p.neighborhoodIncomingAmount ?? p.neighborhoodInComingAmount ?? 0;
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  // ⭐️ KOD TEMİZLİĞİ 2:
  // Toplamları hesaplarken de artık temiz fonksiyonumuzu kullanıyoruz.
  const totalStock = rawmaterials
    ? rawmaterials.data.reduce((total, item) => total + item.incomingAmount, 0)
    : 0;
  const totalNeighborhoodStock = rawmaterials
    ? rawmaterials.data.reduce(
        (total, item) => total + getNeighborhoodStock(item),
        0
      )
    : 0;

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        {/* 🎨 GÜZELLİK 1: Kendi 'Fıstık Pazarı' header'ımız */}
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0">
            <i className="bi bi-shop me-2"></i>Ham Madde Listesi
          </h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            {/* 🎨 GÜZELLİK 2: Kendi 'Fıstık Pazarı' tablo başlığımız */}
            <thead className="thead-fistik align-items-center">
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Siirt'ten Gelen Stok</th>
                <th>Mahalleden Gelen Stok</th>
                <th>Açıklama</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {rawmaterials && rawmaterials.data.length > 0 ? (
                rawmaterials.data.map((p) => {
                  // ⭐️ KOD TEMİZLİĞİ 3:
                  // Mahalle stoğunu DÖNGÜ BAŞINDA BİR KERE hesaplıyoruz.
                  const neighborhoodStock = getNeighborhoodStock(p);

                  return (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{formatNumber(p.incomingAmount)}</td>
                      <td>
                        {/* ⭐️ Artık sadece temiz değişkeni kullanıyoruz */}
                        {formatNumber(neighborhoodStock)}
                      </td>
                      <td>{p.description}</td>
                      <td>
                        {/* ⭐️ Koşulda da temiz değişkeni kullanıyoruz */}
                        {neighborhoodStock === 0 ? (
                          <button
                            className="btn btn-warning me-2 py-1"
                            onClick={() => {
                              setSelectedProduct(p);
                              setShowModal(true);
                            }}
                          >
                            {/* 🎨 GÜZELLİK 3: İKONLAR! */}
                            <i className="bi bi-truck me-1"></i>
                            Mahalle İşlemi
                          </button>
                        ) : null}

                        <button className="btn btn-info me-2 py-1">
                          <i className="bi bi-send me-1"></i>
                          Fas./Kom. Gönder
                        </button>
                        <button
                          className="btn btn-primary py-1"
                          onClick={() => {
                            setSelectedForProcessed(p);
                            setShowProcessedModal(true);
                          }}
                        >
                          <i className="bi bi-gear-fill me-1"></i>
                          İşleme Gönder
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    Ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
            {/* 🎨 GÜZELLİK 4: Daha temiz ve hizalı bir 'tfoot' */}
            <tfoot className="table-group-divider">
              <tr className="total-row">
                <th colSpan={4} className="text-end">
                  Siirt'ten Gelen Toplam Stok:
                </th>
                <th className="text-start">{formatNumber(totalStock)}</th>
                <td></td>
              </tr>
              <tr className="total-row">
                <th colSpan={4} className="text-end">
                  Mahalleden Gelen Toplam Stok:
                </th>
                <th className="text-start">
                  {formatNumber(totalNeighborhoodStock)}
                </th>
                <td></td>
              </tr>
              <tr className="total-row-grand">
                <th colSpan={4} className="text-end">
                  Genel Toplam Stok:
                </th>
                <th className="text-start">
                  {formatNumber(totalStock + totalNeighborhoodStock)}
                </th>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {/* Mahalle Gönderme Modalı */}
          <NeighborhoodSendModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            product={selectedProduct}
          />
          <RawMaterialToProcessedModal
            show={showProcessedModal}
            handleClose={() => setShowProcessedModal(false)}
            product={selectedForProcessed}
          />
        </div>
      </div>
    </div>
  );
}

export default RawMaterialList;
