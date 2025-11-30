import { useGetInventoryStatusQuery } from "../services/productService";
import { formatNumber } from "../utilities/formatters";
import { useNavigate } from "react-router-dom";
import "./css/StockList.css";

export default function StockList() {
  const { data, isLoading, isError } = useGetInventoryStatusQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center mt-5">Yükleniyor...</div>;
  }

  if (isError) {
    return (
      <div className="alert alert-danger text-center my-3">
        Stok verileri yüklenirken hata oluştu.
      </div>
    );
  }

  const inventory = data?.data;

  if (!inventory) {
    return (
      <div className="alert alert-warning text-center my-3">
        Stok verisi bulunamadı.
      </div>
    );
  }

  // Stok kategorileri
  const stockCategories = [
    {
      title: "Ham Madde",
      icon: "bi-box-fill",
      cssClass: "raw-material",
      count: inventory.totalRawMaterialCount,
      stock: inventory.totalRawMaterialStock,
      route: "/rawmaterial-list",
    },
    {
      title: "İşlemde Olanlar",
      icon: "bi-gear-fill",
      cssClass: "processing",
      count: inventory.totalProductToProcessCount,
      stock: inventory.totalProductToProcessStock,
      route: "/productToProcessed",
    },
    {
      title: "İşlenmiş Ürünler",
      icon: "bi-box-seam",
      cssClass: "processed",
      count: inventory.totalProcessedProduceCount,
      stock: inventory.totalProcessedProduceStock,
      route: "/processedproduct",
    },
    {
      title: "Mahalle Ürünleri",
      icon: "bi-house-fill",
      cssClass: "neighborhood",
      count: inventory.totalNeighborhoodCount,
      stock: inventory.totalNeighborhoodStock,
      route: "/neighborhood-list",
    },
    {
      title: "Paketlenecekler",
      icon: "bi-archive-fill",
      cssClass: "packaging",
      count: inventory.totalToPackagedCount,
      stock: inventory.totalToPackagedStock,
      route: "/to-be-packaged",
    },
    {
      title: "Hazır Ürünler",
      icon: "bi-bag-check-fill",
      cssClass: "ready",
      count: inventory.totalProductCount,
      stock: inventory.totalProductStock,
      route: "/product-list",
    },
  ];

  return (
    <>
      {/* Genel Toplam Kartı */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-lg border-0">
            <div className="card-header stock-grand-total-header text-white text-center py-4">
              <h3 className="mb-0">
                <i className="bi bi-clipboard-data me-3"></i>
                Genel Stok Durumu
              </h3>
            </div>
            <div className="card-body text-center py-5">
              <h1 className="display-3 fw-bold grand-total-amount mb-2">
                {formatNumber(inventory.grandTotalStock)} kg
              </h1>
              <p className="text-muted fs-5">Toplam Stok Miktarı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Kartları */}
      <div className="row g-4">
        {stockCategories.map((category, index) => (
          <div key={index} className="col-lg-4 col-md-6">
            <div className="card shadow-sm border-0 h-100 stock-category-card">
              <div
                className={`card-header category-${category.cssClass} text-white d-flex align-items-center justify-content-between py-3`}
              >
                <h5 className="mb-0">
                  <i className={`${category.icon} me-2`}></i>
                  {category.title}
                </h5>
                <span className="category-badge">
                  {category.count} Kayıt
                </span>
              </div>
              <div className="card-body d-flex flex-column justify-content-center align-items-center py-4">
                <div className="text-center">
                  <h2 className={`display-5 fw-bold mb-2 stock-amount-${category.cssClass}`}>
                    {formatNumber(category.stock)} kg
                  </h2>
                  <p className="text-muted mb-0">Toplam Miktar</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detaylı İstatistikler Tablosu */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header card-header-fistik text-white">
              <h5 className="mb-0">
                <i className="bi bi-table me-2"></i>Detaylı İstatistikler
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
              <table className="table table-hover table-striped align-middle">
                <thead className="thead-fistik">
                  <tr>
                    <th>Kategori</th>
                    <th className="text-center">Kayıt Sayısı</th>
                    <th className="text-end">Toplam Stok (kg)</th>
                    <th className="text-end">Yüzde (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {stockCategories.map((category, index) => {
                    const percentage = inventory.grandTotalStock > 0
                      ? ((category.stock / inventory.grandTotalStock) * 100).toFixed(2)
                      : "0.00";
                    return (
                      <tr 
                        key={index} 
                        onClick={() => navigate(category.route)}
                        className="clickable-row"
                      >
                        <td>
                          <i className={`${category.icon} me-2 icon-${category.cssClass}`}></i>
                          <strong>{category.title}</strong>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary">{category.count}</span>
                        </td>
                        <td className="text-end">{formatNumber(category.stock)}</td>
                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end">
                            <div className="progress me-2" style={{ width: "100px", height: "20px" }}>
                              <div
                                className={`progress-bar progress-bar-${category.cssClass}`}
                                role="progressbar"
                                style={{ width: `${percentage}%` }}
                                aria-valuenow={parseFloat(percentage)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <span className="fw-bold">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-group-divider">
                  <tr className="total-row-grand">
                    <th>GENEL TOPLAM</th>
                    <th className="text-center">
                      {stockCategories.reduce((sum, cat) => sum + cat.count, 0)}
                    </th>
                    <th className="text-end">{formatNumber(inventory.grandTotalStock)}</th>
                    <th className="text-end">100.00%</th>
                  </tr>
                </tfoot>
              </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}