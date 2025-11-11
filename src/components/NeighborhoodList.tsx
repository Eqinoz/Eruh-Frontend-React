import { useGetNeighborhoodsQuery } from "../services/neighborhoodService";
import { useState } from "react";
import type { Neighborhood } from "../models/neigborhoodModel";

import { formatDate, formatNumber } from "../utilities/formatters";
import NeighborhoodProcessModal from "./NeighborhoodProcessModal";

function NeighborhoodList() {
  const {
    data: neighborhoods,
    isLoading,
    isError,
  } = useGetNeighborhoodsQuery();

  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<Neighborhood | null>(null);

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const totalAmount: number = neighborhoods
    ? neighborhoods.data.reduce((sum, n) => sum + n.amount, 0)
    : 0;

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
                <th>Gönderilme Tarihi</th>
                <th>İşlem</th>
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
                    <td>{formatNumber(n.amount)}</td>
                    <td>{formatDate(n.dateOfArrival)}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setSelectedNeighborhood(n);
                          setShowProcessModal(true);
                        }}
                      >
                        İşlemi Tamamla
                      </button>
                    </td>
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
            <tfoot className="table-grey">
              <tr>
                <th colSpan={2}>Genel Toplam:</th>
                <th colSpan={6}> {formatNumber(totalAmount)}</th>
              </tr>
            </tfoot>
          </table>
          {/* Process modal */}
          <NeighborhoodProcessModal
            show={showProcessModal}
            handleClose={() => {
              setShowProcessModal(false);
              setSelectedNeighborhood(null);
            }}
            neighborhood={selectedNeighborhood}
          />
        </div>
      </div>
    </div>
  );
}

export default NeighborhoodList;
