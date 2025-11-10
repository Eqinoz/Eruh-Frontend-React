import { useGetNeighborhoodsQuery } from "../services/neighborhoodService";
import type { Neighborhood } from "../models/neigborhoodModel";

function NeighborhoodList() {
  const {
    data: neighborhoods,
    isLoading,
    isError,
  } = useGetNeighborhoodsQuery();

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between ">
          <h5 className="mb-0">Mahalle Ürünleri</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-dark align-items-center">
              <tr>
                <th>ID</th>
                <th>Ürün Tipi</th>
                <th>Adı</th>
                <th>Açıklama</th>
                <th>Miktar</th>
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
                    <td>{n.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Mahalle ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NeighborhoodList;
