import { useGetProcessedProductsQuery } from "../services/processedProductService";
import type { ProcessedProduct } from "../models/processedProductModel";
import { formatNumber } from "../utilities/formatters";

function ProcessedProductList() {
  const {
    data: processed,
    isLoading,
    isError,
  } = useGetProcessedProductsQuery();

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const totalAmount: number = processed
    ? processed.data.reduce((sum, p) => sum + p.amount, 0)
    : 0;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white d-flex justify-content-between ">
          <h5 className="mb-0">İşlenmiş Ürünler</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-dark align-items-center">
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Açıklama</th>
                <th>Miktar</th>
                <th>Kaynak</th>
              </tr>
            </thead>
            <tbody>
              {processed && processed.data && processed.data.length > 0 ? (
                processed.data.map((p: ProcessedProduct) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.productName}</td>
                    <td>{p.description}</td>
                    <td>{formatNumber(p.amount)}</td>
                    <td>{p.inComingFrom}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    İşlenmiş ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="table-grey">
              <tr>
                <th colSpan={2}>Genel Toplam:</th>
                <th colSpan={3}>{formatNumber(totalAmount)}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProcessedProductList;
