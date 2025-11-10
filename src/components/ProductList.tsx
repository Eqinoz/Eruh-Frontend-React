import { useGetProductsQuery } from "../services/productService";
function ProductListPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  if (isLoading) return;
  <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError) return;
  <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  let counter: number = 1;
  let totalAmount: number = 0;
  if (products) {
    totalAmount = products.data.reduce((sum, p) => sum + p.amount, 0);
  }
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Ürün Listesi</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Açıklama</th>
                <th>Miktar</th>
                <th>Paketleme Şekli</th>
              </tr>
            </thead>
            <tbody>
              {products && products.data.length > 0 ? (
                products.data.map((p) => (
                  <tr key={p.productId}>
                    <td>{counter}</td>
                    <td>{p.productId}</td>
                    <td>{p.name}</td>
                    <td>{p.amount}</td>
                    <td>{p.packagingType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center text-muted">Ürün bulunamadı</td>
                </tr>
              )}
            </tbody>
            <tfoot className="table-grey">
              <tr>
                <th colSpan={3}>Genel Toplam</th>
                <th> {totalAmount}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
export default ProductListPage;
