import ExcelButton from "../common/ExcelButton";
import { useGetContractorDetailQuery } from "../services/contractorProductService";
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";

function ContractorProductList() {
  // 'getContractorDetail' endpoint'i tüm listeyi DTO olarak dönüyor varsayıyoruz
  const { data: listResponse, isLoading, isError } = useGetContractorDetailQuery();

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError) return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  //Excel İşlemleri

  const columns = [
    { header: "Muhatap", key: "contractorName" },
    { header: "Ürün", key: "productName" },
    { header: "Gönderim Tarihi", key: "shippedDate" },
    { header: "Miktar", key: "amount" },
  ];

  const excelData = listResponse?.data.map((item) => ({
    contractorName: item.contractorName,
    productName: item.productName,
    shippedDate: formatDate(item.shippedDate),
    amount: formatNumber(item.amount),
  })) ?? [];

  const items = listResponse?.data || [];

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-header card-header-fistik text-white d-flex justify-content-between">
          <h5 className="mb-0">
            <i className="bi bi-arrow-left-right me-2"></i>Dışarıdaki Ürünler (Fason/Komisyon)
          </h5>
          <ExcelButton 
            data={excelData} 
            columns={columns} 
            fileName="Dışarıdaki-Ürünler"
            title="Dışarıdaki Ürünler"
            disabled={isLoading} 
          />
        </div>
        <div className="card-body p-0">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="thead-fistik">
              <tr>
                <th>Muhatap (Fason/Komisyoncu)</th>
                <th>Ürün</th>
                <th>Gönderim Tarihi</th>
                <th className="text-end">Miktar</th>
                {/* <th className="text-center">İşlem</th> (Gerekirse iade butonu buraya) */}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4 text-muted">Dışarıda ürün bulunmuyor.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold text-dark">{item.contractorName}</td>
                    <td>{item.productName}</td>
                    <td>{formatDate(item.shippedDate)}</td>
                    <td className="text-end fw-bold text-success">{formatNumber(item.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ContractorProductList;