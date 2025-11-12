import { Table, Spinner, Alert, Button, Badge } from "react-bootstrap";
import { useGetProductToProcessedsQuery } from "../services/productToProcessedService";

function formatDate(iso?: string) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function ProcessingList() {
  const { data, isLoading, isError } = useGetProductToProcessedsQuery();

  if (isLoading)
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner animation="border" />
      </div>
    );

  if (isError)
    return (
      <Alert variant="danger" className="my-3">
        İşleme alınan ürünler yüklenirken hata oluştu.
      </Alert>
    );

  const items = data?.data ?? [];

  if (items.length === 0)
    return (
      <Alert variant="info" className="my-3">
        Şu anda işleme alınmış ürün bulunmuyor.
      </Alert>
    );

  return (
    <div className="my-3">
      <h5>İşleme Alınan Ürünler</h5>
      <div className="table-responsive mt-2">
        <Table bordered hover size="sm" className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Ürün</th>
              <th>Açıklama</th>
              <th style={{ width: 100 }}>Miktar</th>
              <th style={{ width: 180 }}>Tarih</th>
              <th style={{ width: 120 }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ minWidth: 140 }}>{it.productName}</td>
                <td className="text-truncate" style={{ maxWidth: 360 }}>
                  {it.description || "(Açıklama yok)"}
                </td>
                <td>
                  <Badge bg="primary" pill>
                    {it.amount}
                  </Badge>
                </td>
                <td className="text-muted small">{formatDate(it.dateAdded)}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button size="sm" variant="outline-success">
                      Detay
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
