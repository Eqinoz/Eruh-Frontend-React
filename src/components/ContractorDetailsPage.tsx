import { useParams, useNavigate } from "react-router-dom";
import { useGetContractorDetailQuery } from "../services/contractorProductService";
import { useGetContractorsQuery } from "../services/contractorService";
import { formatDate, formatNumber } from "../utilities/formatters";
import "./css/RawMaterialList.css";

function ContractorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contractorId = Number(id);

  const { data: allProductsResponse, isLoading: isProductsLoading } = useGetContractorDetailQuery();
  const { data: contractorsResponse, isLoading: isContractorLoading } = useGetContractorsQuery();

  if (isProductsLoading || isContractorLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  // 1. Filtreleme: Bu müstahsile ait ürünleri bul
  const contractorProducts = allProductsResponse?.data.filter(
      (p: any) => p.contractorId === contractorId || p.ContractorId === contractorId 
  ) || [];

  // 2. Müstahsil Bilgisini Bul (Modeldeki doğru ismi kullanıyoruz: contractorName)
  // Eğer liste henüz yüklenmediyse veya bulunamazsa güvenli bir obje oluşturuyoruz.
  const contractorInfo = contractorsResponse?.data.find(c => c.id === contractorId);
  const displayName = contractorInfo?.companyName || "Bilinmeyen Müstahsil";

  // 3. Toplam Miktar Hesabı
  const totalAmount = contractorProducts.reduce((sum: number, p: any) => sum + p.amount, 0);

  return (
    <div className="container-fluid px-4 mt-4">
      
      {/* BAŞLIK KARTI 
          🎨 DÜZELTME: 'bg-fistik-primary' yerine style ile rengi zorladım. 
          Böylece CSS yüklenmese bile yeşil olur ve yazılar okunur.
      */}
      <div 
        className="card shadow-lg border-0 mb-4 text-white"
        style={{ backgroundColor: '#6B8E23' /* Fıstık Yeşili */, borderRadius: '12px' }}
      >
          <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                  <div className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style={{width: 60, height: 60}}>
                      <i className="bi bi-person-workspace fs-2"></i>
                  </div>
                  <div>
                      <h6 className="opacity-75 mb-0 text-uppercase ls-1" style={{fontSize: '0.85rem'}}>Müstahsil / Fasoncu</h6>
                      <h2 className="fw-bold mb-0">{displayName}</h2>
                      {contractorInfo?.contactNumber && (
                        <small className="opacity-75"><i className="bi bi-telephone-fill me-1"></i>{contractorInfo.contactNumber}</small>
                      )}
                  </div>
              </div>
              <div className="text-end">
                  <h6 className="opacity-75 mb-1">Toplam Emanet Ürün</h6>
                  <div className="display-6 fw-bold">
                    {formatNumber(totalAmount)} <span className="fs-4">Kg</span>
                  </div>
              </div>
          </div>
      </div>

      {/* LİSTE */}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-white border-bottom py-3">
            <h5 className="mb-0" style={{ color: '#2E8B57' /* Koyu Yeşil */ }}>
              <i className="bi bi-list-check me-2"></i>Elindeki Ürünler Listesi
            </h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Ürün Adı</th>
                <th>Gönderim Tarihi</th>
                <th className="text-end pe-4">Miktar</th>
              </tr>
            </thead>
            <tbody>
              {contractorProducts.length === 0 ? (
                <tr>
                    <td colSpan={3} className="text-center py-5 text-muted">
                        <i className="bi bi-box2 fs-1 d-block mb-2 opacity-25"></i>
                        Bu firmada şuan ürünümüz bulunmuyor.
                    </td>
                </tr>
              ) : (
                contractorProducts.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="fw-bold text-dark ps-4">
                        <span className="d-inline-block bg-success bg-opacity-10 text-success rounded-circle p-1 me-2" style={{width: 8, height: 8}}></span>
                        {item.productName}
                    </td>
                    <td className="text-muted">
                        <i className="bi bi-calendar3 me-2"></i>{formatDate(item.shippedDate)}
                    </td>
                    <td className="text-end fw-bold fs-5 text-success pe-4">
                        {formatNumber(item.amount)} <small className="text-muted fs-6 fw-normal">Kg</small>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 mb-5">
        <button className="btn btn-outline-secondary px-4" onClick={() => navigate("/contractor-list")}>
            <i className="bi bi-arrow-left me-2"></i>Müstahsil Listesine Dön
        </button>
      </div>
    </div>
  );
}

export default ContractorDetailsPage;