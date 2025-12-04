import { useState, useMemo } from "react";
import { Badge, Nav } from "react-bootstrap";
import { useGetStockMovementsQuery } from "../services/stockMovementService";
import type { StockMovementDto } from "../models/stockMovementDtoModel";
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";

function StockMovementList() {
  const { data: response, isLoading, isError } = useGetStockMovementsQuery();
  
  // 🎨 Sekme State'i (0: Hepsi, 1: Ham Madde, 2: İşlenmiş, 3: Satışa Hazır)
  const [activeTab, setActiveTab] = useState<number>(0);

  const allMovements: StockMovementDto[] = response?.data || [];

    const filteredMovements = useMemo(() => {
    if (activeTab === 0) return allMovements;
    return allMovements.filter(m => m.productType === activeTab);
  }, [allMovements, activeTab]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <span className="ms-2 fw-bold text-success">Hareketler Yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-danger m-4 text-center">Veri alınamadı!</div>;
  }

  

  // 🧠 FİLTRELEME MANTIĞI
  // useMemo kullanarak performans kazanalım, her render'da hesaplamasın


  // 🧮 TOPLAM HESAPLAMALARI (Filtrelenmiş veriye göre)
  const totalIn = filteredMovements
    .filter(m => m.isIncoming)
    .reduce((sum, m) => sum + m.amount, 0);

  const totalOut = filteredMovements
    .filter(m => !m.isIncoming)
    .reduce((sum, m) => sum + m.amount, 0);

  const netChange = totalIn - totalOut; // Net değişim

  // Yardımcı: Ürün Tipi İsimleri
  const getProductTypeName = (typeId: number) => {
    switch (typeId) {
      case 1: return "Ham Madde";
      case 2: return "İşlenmiş Ürün";
      case 3: return "Paketli Ürün";
      default: return "-";
    }
  };

  return (
      <div className="card shadow-lg border-0">
        
        {/* HEADER & TABS */}
        <div className="card-header card-header-fistik text-white pb-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              <i className="bi bi-arrow-left-right me-2"></i>Stok Hareket Geçmişi
            </h5>
            <Badge bg="light" text="dark" className="fs-6">
                {filteredMovements.length} Kayıt
            </Badge>
          </div>

          {/* 🎨 SEKMELER (Nav Tabs) */}
          <Nav variant="tabs" className="border-bottom-0 fistik-tabs">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 0} 
                onClick={() => setActiveTab(0)}
                className={activeTab === 0 ? "text-success fw-bold bg-white" : "text-white opacity-75"}
              >
                Tümü
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 1} 
                onClick={() => setActiveTab(1)}
                className={activeTab === 1 ? "text-success fw-bold bg-white" : "text-white opacity-75"}
              >
                <i className="bi bi-box-seam me-1"></i>Ham Madde
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 2} 
                onClick={() => setActiveTab(2)}
                className={activeTab === 2 ? "text-success fw-bold bg-white" : "text-white opacity-75"}
              >
                <i className="bi bi-gear-wide-connected me-1"></i>İşlenmiş
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 3} 
                onClick={() => setActiveTab(3)}
                className={activeTab === 3 ? "text-success fw-bold bg-white" : "text-white opacity-75"}
              >
                <i className="bi bi-bag-check me-1"></i>Satışa Hazır
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* BODY */}
        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="thead-fistik sticky-top" style={{ zIndex: 1 }}>
                <tr>
                  <th className="text-center" style={{ width: "50px" }}>Yön</th>
                  <th>Tarih</th>
                  <th>Ürün ID</th>
                  <th>Ürün Tipi</th>
                  <th>Ürün Adı</th>
                  <th>Açıklama</th>
                  <th className="text-end pe-4">Miktar</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      <i className="bi bi-filter-circle fs-1 d-block mb-2 opacity-50"></i>
                      Bu kategoride hareket kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((move) => (
                    <tr key={move.id}>
                      <td className="text-center">
                        {move.isIncoming ? (
                          <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-2">
                             <i className="bi bi-arrow-down fs-5"></i>
                          </div>
                        ) : (
                          <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-2">
                             <i className="bi bi-arrow-up fs-5"></i>
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold text-secondary">{formatDate(move.movementDate)}</td>
                      <td><span className="badge bg-light text-dark border">#{move.productId}</span></td>
                      <td>{getProductTypeName(move.productType)}</td>
                      <td>{move.productName}</td>
                      <td className="text-muted small text-truncate" style={{maxWidth: '300px'}}>{move.description}</td>
                      <td className={`text-end pe-4 fw-bold fs-5 ${move.isIncoming ? 'text-success' : 'text-danger'}`}>
                        {move.isIncoming ? '+' : '-'}{formatNumber(move.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🎨 FOOTER: İSTATİSTİK KARTLARI */}
        <div className="card-footer bg-light p-4">
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="border rounded p-3 bg-white border-success border-start-0 border-end-0 border-top-0 border-3 shadow-sm">
                        <small className="text-muted text-uppercase fw-bold ls-1">Toplam Giriş</small>
                        <div className="fs-3 fw-bold text-success mt-1">
                            <i className="bi bi-arrow-down-circle me-2"></i>
                            {formatNumber(totalIn)}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="border rounded p-3 bg-white border-danger border-start-0 border-end-0 border-top-0 border-3 shadow-sm">
                        <small className="text-muted text-uppercase fw-bold ls-1">Toplam Çıkış</small>
                        <div className="fs-3 fw-bold text-danger mt-1">
                            <i className="bi bi-arrow-up-circle me-2"></i>
                            {formatNumber(totalOut)}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`border rounded p-3 bg-white border-start-0 border-end-0 border-top-0 border-3 shadow-sm ${netChange >= 0 ? 'border-primary' : 'border-warning'}`}>
                        <small className="text-muted text-uppercase fw-bold ls-1">Net Değişim (Stok Farkı)</small>
                        <div className={`fs-3 fw-bold mt-1 ${netChange >= 0 ? 'text-primary' : 'text-warning'}`}>
                            <i className="bi bi-activity me-2"></i>
                            {netChange > 0 ? '+' : ''}{formatNumber(netChange)}
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default StockMovementList;