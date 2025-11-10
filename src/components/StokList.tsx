import { useGetRawMaterialsQuery } from "../services/rawMaterialService";
import NeighborhoodSendModal from "./NeighborhoodModal";
import { useState } from "react";
import type { RawMaterial } from "../models/rawMaterialModel";

function StokList() {
  const { data: rawmaterials, isLoading, isError } = useGetRawMaterialsQuery();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<RawMaterial | null>(
    null
  );

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between ">
          <h5 className="mb-0">Ham Madde Listesi</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-dark align-items-center">
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Siirten Gelen Stok</th>
                <th>Açıklama</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {rawmaterials && rawmaterials.data.length > 0 ? (
                rawmaterials.data.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.incomingAmount}</td>
                    <td>{p.description}</td>

                    <td>
                      <button
                        className="btn btn-warning py-1 me-2"
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowModal(true);
                        }}
                      >
                        Mahalleye Gönder
                      </button>
                      <button className="btn btn-warning me-2 py-1">
                        F. Veya Kom. Gönder
                      </button>
                      <button className="btn btn-success me-2 py-1">
                        Satışa Hazır
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mahalle Gönderme Modalı */}
          <NeighborhoodSendModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            product={selectedProduct}
          />
        </div>
      </div>
    </div>
  );
}

export default StokList;
