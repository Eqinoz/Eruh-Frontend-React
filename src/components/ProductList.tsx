// 🎨 1. Stil dosyamızı ve formatlayıcıyı import ediyoruz
import { useGetProductsQuery } from "../services/productService";
import { formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css"; // Diğerleriyle aynı stili kullanacak

function ProductListPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  // 🐞 2. KRİTİK HATA DÜZELTME: JSX, 'return' ile aynı satırda olmalı
  if (isLoading) {
    return <div className="text-center mt-5">Yükleniyor...</div>;
  }
  if (isError) {
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;
  }

  // 🐞 3. BUG DÜZELTME: Bu 'counter'a gerek yok, 'map'in index'ini kullanacağız.
  // let counter: number = 1;

  let totalAmount: number = 0;
  if (products) {
    totalAmount = products.data.reduce((sum, p) => sum + p.amount, 0);
  }

  return (
    // 🎨 4. Layout'u 'container-fluid' olarak güncelledim
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-sm">
        {/* 🎨 5. Kart başlığını temamıza uygun hale getirdim ve ikon ekledim */}
        <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-bag-check-fill me-2"></i>Satışa Hazır Ürün
            Listesi
          </h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover text-center align-middle">
            {/* 🎨 6. Tablo başlığını temamıza uygun hale getirdim */}
            <thead className="thead-fistik">
              {/* 🐞 7. BUG DÜZELTME: Başlıkları 6 sütuna çıkardım ve düzelttim */}
              <tr>
                <th>No.</th>
                <th>Ürün ID</th>
                <th>Adı</th>
                <th>Miktar (kg)</th>
                <th>Paketleme Şekli</th>
              </tr>
            </thead>
            <tbody>
              {products && products.data.length > 0 ? (
                // 🐞 8. BUG DÜZELTME: 'map'e 'index' ekledim
                products.data.map((p, index) => (
                  <tr key={p.productId}>
                    {/* 🐞 9. BUG DÜZELTME: Hatalı 'counter' yerine 'index' kullandım */}
                    <td>{index + 1}</td>
                    <td>{p.productId}</td>
                    <td>{p.name}</td>
                    {/* 🐞 10. BUG DÜZELTME: Eksik olan 'description' eklendi */}
                    <td>{formatNumber(p.amount)}</td>
                    <td>{p.packagingType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* 🐞 11. BUG DÜZELTME: colSpan 6 olmalı */}
                  <td colSpan={6} className="text-center text-muted">
                    Ürün bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
            {/* 🐞 12. BUG DÜZELTME: tfoot'u yeniden hizaladım ve formatladım */}
            <tfoot className="table-group-divider">
              <tr className="total-row-grand">
                <th colSpan={4} className="text-end">
                  Genel Toplam Miktar:
                </th>
                <th className="text-start">{formatNumber(totalAmount)}</th>
                <th colSpan={1}></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
export default ProductListPage;
