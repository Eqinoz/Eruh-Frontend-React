import { useState } from "react";
import { useGetRawMaterialsQuery } from "../services/rawMaterialService";
import type { RawMaterial } from "../models/rawMaterialModel";
import { formatNumber } from "../utilities/formatters";
import ExcelButton from "../common/ExcelButton";
// MODALLAR
import NeighborhoodSendModal from "./modals/NeighborhoodModal";
import RawMaterialToProcessedModal from "./modals/RawMaterialToProcessedModal";
import AddStockModal from "./modals/AddRawMaterialStockModal";
import DeleteStockModal from "./modals/DeleteRawMaterialStockModal";
import "./css/RawMaterialList.css";

function RawMaterialList() {
  const { data: rawmaterials, isLoading, isError } = useGetRawMaterialsQuery();

  // --- MODAL STATE'LERİ ---
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const [showProcessedModal, setShowProcessedModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false); 
  const [showDeleteStockModal, setShowDeleteStockModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<RawMaterial | null>(null);

  // --- EXCEL İŞLEMİ (Aynı Kalıyor) ---
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
      incomingAmount: item.incomingAmount, // Excel için ham sayı daha iyidir, formatNumber string yapar
      neighborhoodInComingAmount: (item as any).neighborhoodIncomingAmount ?? (item as any).neighborhoodInComingAmount ?? 0,
      description: item.description,
  })) ?? [];


  // --- YARDIMCI FONKSİYONLAR ---
  const getNeighborhoodStock = (item: RawMaterial): number => {
    const p = item as any;
    return p.neighborhoodIncomingAmount ?? p.neighborhoodInComingAmount ?? 0;
  };

  

  // --- MODAL AÇMA FONKSİYONLARI ---
  const handleOpenNeighborhoodModal = (p: RawMaterial) => {
      setSelectedProduct(p);
      setShowNeighborhoodModal(true);
  };

  const handleOpenDeleteStockModal = (p: RawMaterial) => {
      setSelectedProduct(p);
      setShowDeleteStockModal(true);
  };

  const handleOpenProcessedModal = (p: RawMaterial) => {
      setSelectedProduct(p);
      setShowProcessedModal(true);
  };

  const handleOpenAddStockModal = (p: RawMaterial) => {
      setSelectedProduct(p);
      setShowAddStockModal(true);
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
            title="ERUH FISTIK PAZARI - HAM MADDE STOK LİSTESİ"
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
                      <td>
                          {/* Siirt Stoğu */}
                          <span className="fw-bold text-dark">{formatNumber(p.incomingAmount)}</span>
                      </td>
                      <td>{formatNumber(neighborhoodStock)}</td>
                      <td>{p.description}</td>
                      <td>
                        <div className="btn-group" role="group">
                            
                            
                            <button className="btn btn-sm btn-success" onClick={() => handleOpenAddStockModal(p)} title="Hızlı Stok Ekle">
                                <i className="bi bi-plus-lg"></i>
                            </button>

                            
                            {p.incomingAmount > 0 && (
                                <button className="btn btn-sm btn-warning" onClick={() => handleOpenNeighborhoodModal(p)} title="Mahalleye Gönder">
                                    <i className="bi bi-truck"></i>
                                </button>
                            )}
                            <button className="btn btn-sm btn-primary" onClick={() => handleOpenProcessedModal(p)} title="İşlemeye Gönder">
                                <i className="bi bi-gear-fill"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteStockModal(p)} title="Stok Çıkar">
                                <i className="bi bi-dash-lg"></i>
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
          
          <AddStockModal 
            show={showAddStockModal}
            handleClose={() => setShowAddStockModal(false)}
            product={selectedProduct}
          />
          <DeleteStockModal 
            show={showDeleteStockModal}
            handleClose={() => setShowDeleteStockModal(false)}
            product={selectedProduct}
          />

          </div>
        </div>
      </div>
    </div>
  );
}

export default RawMaterialList;