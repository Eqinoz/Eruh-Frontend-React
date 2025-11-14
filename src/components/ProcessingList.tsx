// 🐞 1. React-Bootstrap importları KALDIRILDI.
import { useGetProductToProcessedsQuery } from "../services/productToProcessedService";
// 🎨 2. Kendi formatlayıcılarımızı ve stilimizi import ettik
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css"; // Diğerleriyle aynı stili kullanacak

// 🐞 3. Yerel formatDate fonksiyonu KALDIRILDI.

export default function ProcessingList() {
  const { data, isLoading, isError } = useGetProductToProcessedsQuery();

  // 🎨 4. Yüklenme ve hata ekranlarını standart div'lere çevirdim
  if (isLoading) {
    return <div className="text-center mt-5">Yükleniyor...</div>;
  }
  if (isError) {
    return (
      <div className="alert alert-danger text-center my-3">
        İşleme alınan ürünler yüklenirken hata oluştu.
      </div>
    );
  }

  const items = data?.data ?? [];

  // 🎨 5. tfoot için toplam miktar hesaplaması
  const totalAmount: number = items.reduce((sum, p) => sum + p.amount, 0);

  return (
    // 🎨 6. Standart "Fıstık Pazarı" layout'umuzu ekledim
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between ">
          <h5 className="mb-0">
            {/* SideBar'daki "İşlemde Olanlar" ikonuyla aynı */}
            <i className="bi bi-list-ul me-2"></i>İşleme Alınan Ürünler
          </h5>
        </div>
        <div className="card-body">
          {items.length === 0 ? (
            // 🎨 7. Boş liste uyarısını standart alert'e çevirdim
            <div className="alert alert-info text-center">
              Şu anda işleme alınmış ürün bulunmuyor.
            </div>
          ) : (
            // 🎨 8. Standart tabloya çevirdim
            <table className="table table-striped table-hover text-center align-middle">
              {/* 🎨 9. Standart tablo başlığına çevirdim */}
              <thead className="thead-fistik align-items-center">
                <tr>
                  <th>Ürün</th>
                  <th>Açıklama</th>
                  <th>Miktar (kg)</th>
                  <th>Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.productName}</td>
                    {/* Açıklama için 'truncate' (kısaltma) güzel bir dokunuş, onu korudum */}
                    <td className="text-truncate" style={{ maxWidth: 360 }}>
                      {it.description || "(Açıklama yok)"}
                    </td>
                    <td>
                      {/* 🎨 10. Badge yerine standart formatNumber */}
                      {formatNumber(it.amount)}
                    </td>
                    <td>
                      {/* 🎨 11. Kendi formatDate'imizi kullandım */}
                      {formatDate(it.dateAdded)}
                    </td>
                    <td>
                      {/* 🎨 12. Standart butona çevirdim ve ikon ekledim */}
                      <button className="btn btn-sm btn-outline-success">
                        <i className="bi bi-search me-1"></i>
                        Detay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* 🎨 13. Standart tfoot'umuzu ekledim */}
              <tfoot className="table-group-divider">
                <tr className="total-row-grand">
                  <th colSpan={2} className="text-end">
                    Toplam Miktar:
                  </th>
                  <th className="text-start">{formatNumber(totalAmount)}</th>
                  <th colSpan={2}></th>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
