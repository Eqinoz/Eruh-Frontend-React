import { useGetProcessedProductsQuery } from "../services/processedProductService";
import type { ProcessedProduct } from "../models/processedProductModel";
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css"; // 👈 STİLLER İÇİN BUNU EKLEDİM!

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
    // 🎨 1. Layout'u 'container-fluid' olarak güncelledim
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        {/* 🎨 2. Kart başlığını temamıza uygun hale getirdim ve ikon ekledim */}
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0">
            <i className="bi bi-box-seam me-2"></i>İşlenmiş Ürünler
          </h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            {/* 🎨 3. Tablo başlığını temamıza uygun hale getirdim */}
            <thead className="thead-fistik align-items-center">
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Açıklama</th>
                <th>Miktar (kg)</th>
                <th>Kaynak</th>
                <th>Stoğa Eklendiği Tarih</th>
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
                    <td>{formatDate(p.dateAdded)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* 🐞 4. HATA DÜZELTME: colSpan 5 idi, 6 yaptım */}
                  <td colSpan={6} className="text-center text-muted">
                    İşlenmiş ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
            {/* 🐞 5. HATA DÜZELTME: tfoot'u tamamen yeniden hizaladım */}
            <tfoot className="table-group-divider">
              <tr className="total-row-grand">
                {/* Toplam başlığı sağa yaslı */}
                <th colSpan={3} className="text-end">
                  Genel Toplam Miktar:
                </th>
                {/* Toplam değer sola yaslı */}
                <th className="text-start">{formatNumber(totalAmount)}</th>
                {/* Kalan 2 sütun boş */}
                <th colSpan={2}></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProcessedProductList;
