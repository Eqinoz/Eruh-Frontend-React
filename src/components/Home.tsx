import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { useGetDetailsOrderQuery } from "../services/orderService";
import { useGetProductsQuery, useGetInventoryStatusQuery } from "../services/productService";
import { formatDate, formatNumber } from "../utilities/formatters";
import type { OrderDtoModel } from "../models/orderDtoModel";
import type { ProductModel } from "../models/productModel";
import "./css/Home.css";

function Home() {
  const navigate = useNavigate();

  // --- VERİLERİ ÇEK ---
  const { data: ordersResponse, isLoading: ordersLoading } =
    useGetDetailsOrderQuery();
  const { data: productsResponse, isLoading: productsLoading } =
    useGetProductsQuery();
  const { data: inventoryResponse, isLoading: inventoryLoading } =
    useGetInventoryStatusQuery();

  if (ordersLoading || productsLoading || inventoryLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 home-container">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  const allOrders: OrderDtoModel[] = ordersResponse?.data || [];
  const allProducts: ProductModel[] = productsResponse?.data || [];
  const inventoryStatus = inventoryResponse?.data;

  // --- ANALİZ VE FİLTRELEME ---

  // 1. Bekleyen Siparişler (ShippedDate NULL olanlar)
  const pendingOrders = allOrders.filter((o) => o.shippedDate === null);

  // 2. Günü Yaklaşan / Geçen Ödemeler (Teslim edilmiş ama ödenmemiş)
  const unpaidOrders = allOrders.filter(
    (o) => o.shippedDate !== null && o.isPayment === false
  );

  // Ödemeleri tarihe göre sırala (En acil olan en üstte)
  const criticalPayments = unpaidOrders
    .map((order) => {
      const today = new Date();
      const maturity = new Date(order.lines.maturityDate);
      const diffTime = maturity.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...order, diffDays };
    })
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 5);

  // 3. Stok Özeti (İlk 5 ürün)
  const topProducts = [...allProducts]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Toplam Bekleyen Tutar (Tahsilat)
  const totalReceivable = unpaidOrders.reduce(
    (sum, o) => sum + o.lines.taxTotalPrice,
    0
  );

  return (
    <div className="home-container">
      <div className="container-fluid px-4">
        {/* --- KPI KARTLARI --- */}
        <div className="row g-4 mb-5">
          {/* Kart 1: Toplam Stok */}
          <div className="col-lg-3 col-md-6 animate-fade-in delay-1">
            <div className="kpi-card primary" onClick={() => navigate("/stock-list")} style={{ cursor: "pointer" }}>
              <div className="d-flex justify-content-between align-items-start h-100">
                <div className="d-flex flex-column justify-content-between h-100">
                  <div>
                    <div className="kpi-icon-wrapper primary">
                      <i className="bi bi-box-fill"></i>
                    </div>
                    <div className="kpi-value">
                      {inventoryStatus ? formatNumber(inventoryStatus.grandTotalStock) : "0"} kg
                    </div>
                    <div className="kpi-label">Toplam Stok</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kart 2: Bekleyen Sipariş */}
          <div className="col-lg-3 col-md-6 animate-fade-in delay-2">
            <div className="kpi-card warning" onClick={() => navigate("/order-list")} style={{ cursor: "pointer" }}>
              <div className="d-flex justify-content-between align-items-start h-100">
                <div className="d-flex flex-column justify-content-between h-100">
                  <div>
                    <div className="kpi-icon-wrapper warning">
                      <i className="bi bi-box-seam"></i>
                    </div>
                    <div className="kpi-value">{pendingOrders.length}</div>
                    <div className="kpi-label">Hazırlanacak Sipariş</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kart 3: Hazır Ürünler */}
          <div className="col-lg-3 col-md-6 animate-fade-in delay-3">
            <div className="kpi-card info" onClick={() => navigate("/product-list")} style={{ cursor: "pointer" }}>
              <div className="d-flex justify-content-between align-items-start h-100">
                <div className="d-flex flex-column justify-content-between h-100">
                  <div>
                    <div className="kpi-icon-wrapper info">
                      <i className="bi bi-bag-check-fill"></i>
                    </div>
                    <div className="kpi-value">
                      {inventoryStatus ? formatNumber(inventoryStatus.totalProductStock) : "0"} kg
                    </div>
                    <div className="kpi-label">Satışa Hazır Ürün</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kart 4: Toplam Alacak */}
          <div className="col-lg-3 col-md-6 animate-fade-in delay-4">
            <div className="kpi-card success" onClick={() => navigate("/payment-list")} style={{ cursor: "pointer" }}>
              <div className="d-flex justify-content-between align-items-start h-100">
                <div className="d-flex flex-column justify-content-between h-100">
                  <div>
                    <div className="kpi-icon-wrapper success">
                      <i className="bi bi-wallet2"></i>
                    </div>
                    <div className="kpi-value">
                      {formatNumber(totalReceivable)} ₺
                    </div>
                    <div className="kpi-label">Bekleyen Tahsilat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* --- SOL KOLON: GÜNÜ YAKLAŞAN ÖDEMELER --- */}
          <div className="col-lg-8 animate-fade-in delay-2">
            <div className="content-card h-100">
              <div className="content-card-header">
                <h5 className="content-card-title text-danger">
                  <i className="bi bi-alarm"></i>
                  Günü Yaklaşan Ödemeler
                </h5>
                <button
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  onClick={() => navigate("/payment-list")}
                >
                  Tümünü Gör
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Müşteri</th>
                      <th>Vade Tarihi</th>
                      <th className="text-center">Durum</th>
                      <th className="text-end">Tutar</th>
                      <th className="text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalPayments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          <i className="bi bi-emoji-sunglasses fs-1 d-block mb-2"></i>
                          Acil tahsilat yok, keyfine bak!
                        </td>
                      </tr>
                    ) : (
                      criticalPayments.map((order) => (
                        <tr key={order.id}>
                          <td className="fw-semibold">{order.customerName}</td>
                          <td>{formatDate(order.lines.maturityDate)}</td>
                          <td className="text-center">
                            {order.diffDays < 0 ? (
                              <Badge bg="danger" className="px-3 py-2 rounded-pill">
                                {-order.diffDays} Gün Geçti
                              </Badge>
                            ) : order.diffDays <= 3 ? (
                              <Badge
                                bg="warning"
                                text="dark"
                                className="px-3 py-2 rounded-pill"
                              >
                                {order.diffDays} Gün Kaldı
                              </Badge>
                            ) : (
                              <Badge bg="info" className="px-3 py-2 rounded-pill">
                                {order.diffDays} Gün
                              </Badge>
                            )}
                          </td>
                          <td className="text-end fw-bold text-dark">
                            {formatNumber(order.lines.taxTotalPrice)} ₺
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-light rounded-circle border"
                              onClick={() => navigate("/payment-list")}
                              title="Detay"
                            >
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* --- SAĞ KOLON: STOK VE BEKLEYENLER --- */}
          <div className="col-lg-4 animate-fade-in delay-3">
            <div className="d-flex flex-column gap-4">
              {/* 1. Bekleyen Siparişler Özeti */}
              <div className="content-card">
                <div className="content-card-header">
                  <h5 className="content-card-title text-warning">
                    <i className="bi bi-clock-history"></i>
                    Hazırlanacaklar
                  </h5>
                </div>
                <div className="list-group list-group-flush">
                  {pendingOrders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="list-item-custom d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <span className="fw-bold d-block text-dark">
                          {order.customerName}
                        </span>
                        <small className="text-muted">
                          {formatDate(order.orderDate)}
                        </small>
                      </div>
                      <Badge bg="light" text="dark" className="border">
                        #{order.id}
                      </Badge>
                    </div>
                  ))}
                  {pendingOrders.length === 0 && (
                    <div className="p-4 text-center text-muted">
                      Bekleyen sipariş yok.
                    </div>
                  )}
                  {pendingOrders.length > 4 && (
                    <div className="p-3 text-center border-top">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/order-list");
                        }}
                        className="text-decoration-none fw-semibold small"
                      >
                        Tümünü Gör ({pendingOrders.length})
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Stok Durumu Özeti */}
              <div className="content-card">
                <div className="content-card-header">
                  <h5 className="content-card-title text-primary">
                    <i className="bi bi-box2-heart"></i>
                    Satışa Hazır Ürünler
                  </h5>
                </div>
                <div className="p-3">
                  {topProducts.map((product) => (
                    <div key={product.productId} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-semibold small text-dark">
                          {product.name}
                        </span>
                        <span className="small fw-bold text-muted">
                          {formatNumber(product.amount)} Kg
                        </span>
                      </div>
                      <div className="progress-custom">
                        <div
                          className={`progress-bar-custom h-100 ${
                            product.amount < 500 ? "bg-danger" : "bg-success"
                          }`}
                          style={{
                            width: `${Math.min(
                              (product.amount / 10000) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <button
                      className="btn btn-sm btn-outline-primary w-100 rounded-pill"
                      onClick={() => navigate("/product-list")}
                    >
                      Stok Listesine Git
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;