import { useNavigate } from "react-router-dom";
import { Badge, Card, ProgressBar } from "react-bootstrap";
import { useGetDetailsOrderQuery } from "../services/orderService";
import { useGetProductsQuery } from "../services/productService";
import { formatDate, formatNumber } from "../utilities/formatters";
import type { OrderDtoModel } from "../models/orderDtoModel";
import type { ProductModel } from "../models/productModel";
import "./css/RawMaterialList.css"; // Tema stilleri

function Home() {
  const navigate = useNavigate();

  // --- VERİLERİ ÇEK ---
  const { data: ordersResponse, isLoading: ordersLoading } =
    useGetDetailsOrderQuery();
  const { data: productsResponse, isLoading: productsLoading } =
    useGetProductsQuery();

  if (ordersLoading || productsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  const allOrders: OrderDtoModel[] = ordersResponse?.data || [];
  const allProducts: ProductModel[] = productsResponse?.data || [];

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
    .sort((a, b) => a.diffDays - b.diffDays) // Gün sayısına göre sırala
    .slice(0, 5); // Sadece ilk 5 tanesini göster

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
    <div className="container-fluid px-4 mt-4">
      {/* --- BAŞLIK VE TARİH --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-success">
            <i className="bi bi-speedometer2 me-2"></i>Yönetim Paneli
          </h2>
          <p className="text-muted mb-0">
            İşler yolunda mı reis? İşte özet durum.
          </p>
        </div>
        <div className="text-end">
          <h5 className="m-0">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h5>
        </div>
      </div>

      {/* --- KPI KARTLARI (ÜST BİLGİ) --- */}
      <div className="row g-3 mb-4">
        {/* Kart 1: Bekleyen Sipariş */}
        <div className="col-md-4">
          <div className="card shadow-sm border-start border-4 border-warning h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-1">
                  Hazırlanacak Sipariş
                </h6>
                <h2 className="mb-0 fw-bold text-dark">
                  {pendingOrders.length}
                </h2>
              </div>
              <div className="bg-warning bg-opacity-25 p-3 rounded-circle text-warning">
                <i className="bi bi-box-seam fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Kart 2: Toplam Stok */}
        <div className="col-md-4">
          <div className="card shadow-sm border-start border-4 border-primary h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-1">
                  Toplam Ürün Çeşidi
                </h6>
                <h2 className="mb-0 fw-bold text-dark">{allProducts.length}</h2>
              </div>
              <div className="bg-primary bg-opacity-25 p-3 rounded-circle text-primary">
                <i className="bi bi-tags-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Kart 3: Toplam Alacak */}
        <div className="col-md-4">
          <div className="card shadow-sm border-start border-4 border-success h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-1">
                  Toplam Bekleyen Tahsilat
                </h6>
                <h3 className="mb-0 fw-bold text-success">
                  {formatNumber(totalReceivable)} ₺
                </h3>
              </div>
              <div className="bg-success bg-opacity-25 p-3 rounded-circle text-success">
                <i className="bi bi-wallet2 fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* --- SOL KOLON: GÜNÜ YAKLAŞAN ÖDEMELER --- */}
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold text-danger">
                <i className="bi bi-alarm me-2"></i>Günü Yaklaşan / Geçen
                Ödemeler
              </h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => navigate("/payment-list")}
              >
                Tümünü Gör
              </button>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted small">
                  <tr>
                    <th>Müşteri</th>
                    <th>Vade Tarihi</th>
                    <th className="text-center">Kalan Gün</th>
                    <th className="text-end">Tutar</th>
                    <th className="text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        Acil tahsilat yok, keyfine bak! 😎
                      </td>
                    </tr>
                  ) : (
                    criticalPayments.map((order) => (
                      <tr
                        key={order.id}
                        className={
                          order.diffDays < 0 ? "bg-danger bg-opacity-10" : ""
                        }
                      >
                        <td className="fw-bold">{order.customerName}</td>
                        <td>{formatDate(order.lines.maturityDate)}</td>
                        <td className="text-center">
                          {order.diffDays < 0 ? (
                            <Badge bg="danger">
                              {-order.diffDays} Gün Geçti!
                            </Badge>
                          ) : order.diffDays <= 3 ? (
                            <Badge bg="warning" text="dark">
                              {order.diffDays} Gün Kaldı
                            </Badge>
                          ) : (
                            <Badge bg="info">{order.diffDays} Gün</Badge>
                          )}
                        </td>
                        <td className="text-end fw-bold">
                          {formatNumber(order.lines.taxTotalPrice)} ₺
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-light border"
                            onClick={() => navigate("/payment-list")}
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
        <div className="col-lg-4">
          {/* 1. Bekleyen Siparişler Özeti */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-warning text-dark fw-bold">
              <i className="bi bi-clock-history me-2"></i>Hazırlanacak
              Siparişler
            </div>
            <ul className="list-group list-group-flush">
              {pendingOrders.slice(0, 4).map((order) => (
                <li
                  key={order.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span className="fw-bold d-block">
                      {order.customerName}
                    </span>
                    <small className="text-muted">
                      {formatDate(order.orderDate)}
                    </small>
                  </div>
                  <Badge bg="secondary" pill>
                    #{order.id}
                  </Badge>
                </li>
              ))}
              {pendingOrders.length === 0 && (
                <li className="list-group-item text-center text-muted py-3">
                  Bekleyen sipariş yok.
                </li>
              )}
              {pendingOrders.length > 4 && (
                <li className="list-group-item text-center">
                  <small>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/order-list");
                      }}
                      className="text-decoration-none"
                    >
                      Tümünü Gör ({pendingOrders.length})
                    </a>
                  </small>
                </li>
              )}
            </ul>
          </div>

          {/* 2. Stok Durumu Özeti */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              <i className="bi bi-box2-heart me-2"></i>Satışa Hazır Ürünler
            </div>
            <div className="card-body">
              {topProducts.map((product) => (
                <div key={product.productId} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-semibold small">{product.name}</span>
                    <span className="small fw-bold">
                      {formatNumber(product.amount)} Kg
                    </span>
                  </div>
                  {/* Stok doluluk barı (Süs amaçlı, max 10.000 varsaydım) */}
                  <ProgressBar
                    now={(product.amount / 10000) * 100}
                    variant={product.amount < 500 ? "danger" : "success"}
                    style={{ height: "6px" }}
                  />
                </div>
              ))}
              <div className="text-center mt-3">
                <button
                  className="btn btn-sm btn-outline-primary w-100"
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
  );
}

export default Home;
