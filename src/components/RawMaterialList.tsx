import { useState } from "react";
import { useGetRawMaterialsQuery, useDeleteRawMaterialMutation } from "../services/rawMaterialService";
import type { RawMaterial } from "../models/rawMaterialModel";
import { formatNumber } from "../utilities/formatters";
import { toast } from "react-toastify";

// 🎨 MODALLARI IMPORT ET
import NeighborhoodSendModal from "./modals/NeighborhoodModal";
import RawMaterialToProcessedModal from "./modals/RawMaterialToProcessedModal";
import SendToContractorModal from "./modals/SendToContractorModal"; // 👈 YENİ EKLENDİ

import "./css/RawMaterialList.css"; 
import ExcelButton from "../common/ExcelButton";

function RawMaterialList() {
  const { data: rawmaterials, isLoading, isError } = useGetRawMaterialsQuery();
  const [deleteRawMaterial, { isLoading: isDeleting }] = useDeleteRawMaterialMutation();

  // --- MODAL STATE'LERİ ---
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const [showProcessedModal, setShowProcessedModal] = useState(false);
  const [showContractorModal, setShowContractorModal] = useState(false); // 👈 YENİ

  const [selectedProduct, setSelectedProduct] = useState<RawMaterial | null>(null);

  // --- EXCEL İŞLEMİ ---

    
    const columns = [
      {header: "ID", key: 'id', width:15},
      {header: "Adı", key: 'name', width:20},
      {header: "Siirt'ten Gelen Stok", key: 'incomingAmount', width:30},
      {header: "Mahalleden Gelen Stok", key: 'neighborhoodInComingAmount', width:30},
      {header: "Açıklama", key: 'description', width:20},
    ];

    const excelData = rawmaterials?.data.map((item)=> ({
      id: item.id,
      name: item.name,
      incomingAmount: formatNumber(item.incomingAmount),
      neighborhoodInComingAmount: formatNumber(item.neighborhoodInComingAmount),
      description: item.description,
    }))??[];



  // --- YARDIMCI FONKSİYONLAR ---
  const getNeighborhoodStock = (item: RawMaterial): number => {
    const p = item as any;
    return p.neighborhoodIncomingAmount ?? p.neighborhoodInComingAmount ?? 0;
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu ham maddeyi silmek istediğinize emin misiniz?")) {
      try {
        await deleteRawMaterial(id).unwrap();
        toast.success("Ham madde başarıyla silindi.");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Silme işlemi başarısız oldu.");
      }
    }
  };

  // --- MODAL AÇMA FONKSİYONLARI ---
  const handleOpenNeighborhoodModal = (p: RawMaterial) => {
      setSelectedProduct(p);
      setShowNeighborhoodModal(true);
  };

  const handleOpenProcessedModal = (p: RawMaterial) => {
      setSelectedProduct(p);
      setShowProcessedModal(true);
  };

  // 👈 YENİ FONKSİYON: Fasoncuya Gönder Modalı
  const handleOpenContractorModal = (p: RawMaterial) => {
      setSelectedProduct(p);
      setShowContractorModal(true);
  };


  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError) return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const totalStock = rawmaterials ? rawmaterials.data.reduce((total, item) => total + item.incomingAmount, 0) : 0;
  const totalNeighborhoodStock = rawmaterials ? rawmaterials.data.reduce((total, item) => total + getNeighborhoodStock(item), 0) : 0;

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0">
            <i className="bi bi-shop me-2"></i>Ham Madde Listesi
          </h5>
          <ExcelButton
            data={excelData}
            columns={columns}
            fileName="HamMaddeListesi"
            title="Ham Madde Listesi"
            disabled={isLoading}
          />
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="thead-fistik align-items-center">
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Siirt Stok</th>
                <th>Mahalle Stok</th>
                <th>Açıklama</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {rawmaterials && rawmaterials.data.length > 0 ? (
                rawmaterials.data.map((p) => {
                  const neighborhoodStock = getNeighborhoodStock(p);
                  return (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{formatNumber(p.incomingAmount)}</td>
                      <td>{formatNumber(neighborhoodStock)}</td>
                      <td>{p.description}</td>
                      <td>
                        <div className="btn-group" role="group">
                            {/* 1. MAHALLEYE GÖNDER */}
                            {p.incomingAmount > 0 && (
                                <button className="btn btn-sm btn-warning" onClick={() => handleOpenNeighborhoodModal(p)} title="Mahalleye Gönder">
                                    <i className="bi bi-truck"></i>
                                </button>
                            )}

                            {/* 2. İŞLEMEYE GÖNDER */}
                            <button className="btn btn-sm btn-primary" onClick={() => handleOpenProcessedModal(p)} title="İşlemeye Gönder">
                                <i className="bi bi-gear-fill"></i>
                            </button>

                            {/* 3. FASONCUYA GÖNDER (YENİ) */}
                            <button className="btn btn-sm btn-info text-white" onClick={() => handleOpenContractorModal(p)} title="Fasoncuya Gönder">
                                <i className="bi bi-box-arrow-right"></i>
                            </button>

                            {/* 4. SİL */}
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)} disabled={isDeleting} title="Sil">
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} className="text-center text-muted">Ürün bulunamadı</td></tr>
              )}
            </tbody>
            <tfoot className="table-group-divider">
              <tr className="total-row">
                <th colSpan={4} className="text-end">Siirt Toplam:</th>
                <th className="text-start">{formatNumber(totalStock)}</th>
                <td></td>
              </tr>
              <tr className="total-row">
                <th colSpan={4} className="text-end">Mahalle Toplam:</th>
                <th className="text-start">{formatNumber(totalNeighborhoodStock)}</th>
                <td></td>
              </tr>
              <tr className="total-row-grand">
                <th colSpan={4} className="text-end">Genel Toplam:</th>
                <th className="text-start">{formatNumber(totalStock + totalNeighborhoodStock)}</th>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {/* --- MODALLAR --- */}
          <NeighborhoodSendModal
            show={showNeighborhoodModal}
            handleClose={() => setShowNeighborhoodModal(false)}
            product={selectedProduct}
          />
          <RawMaterialToProcessedModal
            show={showProcessedModal}
            handleClose={() => setShowProcessedModal(false)}
            product={selectedProduct}
          />
          {/* 👇 YENİ MODAL EKLENDİ */}
          <SendToContractorModal 
            show={showContractorModal}
            handleClose={() => setShowContractorModal(false)}
            product={selectedProduct}
            sourceType="Fasoncu" // Ham madde genelde fasoncuya gider
          />

        </div>
      </div>
    </div>
  );
}

export default RawMaterialList;