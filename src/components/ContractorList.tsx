import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

// Servisler (Dosya yolunu ve isimleri kendi servisine göre kontrol et)
import { 
  useGetContractorsQuery, 
  useDeleteContractorMutation 
} from "../services/contractorService";

// Stiller
import "./css/RawMaterialList.css"; // Ana tema
import "./css/Modal.css"; // Modal teması

// Model (ContractorModel dosyan varsa oradan import et, yoksa burayı kullan)
export interface ContractorModel {
  id: number;
  companyName: string;
  taxNumber?: string;
  relevantPerson?: string;
  contactNumber?: string;
  address?: string;
  email?: string;
}

function ContractorList() {
  // API Hook'ları
  const { data: contractorsResponse, isLoading, isError } = useGetContractorsQuery();
  const [deleteContractor, { isLoading: isDeleting }] = useDeleteContractorMutation();

  // Modal State'leri
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<ContractorModel | null>(null);

  // Modal Aç/Kapa
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedContractor(null);
  };

  const handleShowDeleteModal = (contractor: ContractorModel) => {
    setSelectedContractor(contractor);
    setShowDeleteModal(true);
  };

  // Silme İşlemi
  const handleConfirmDelete = async () => {
    if (!selectedContractor) return;

    try {
      await deleteContractor(selectedContractor.id).unwrap();
      toast.success(
        `"${selectedContractor.companyName}" başarıyla silindi.`
      );
      handleCloseDeleteModal();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Silme işlemi başarısız oldu.");
    }
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;
  if (isError) return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const contractors: ContractorModel[] = contractorsResponse?.data || [];

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card shadow-lg border-0">
        
        {/* 🎨 Kart Başlığı */}
        <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-person-lines-fill me-2"></i>Fasoncu Ve Komisyoncu Listesi
          </h5>
        </div>

        <div className="card-body p-0">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="thead-fistik">
              <tr>
                <th>ID</th>
                <th>Müstahsil/Firma</th>
                <th>Vergi No</th>
                <th>İlgili Kişi</th>
                <th>Telefon</th>
                <th>E-Posta</th>
                <th>Adres</th>
                <th className="text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {contractors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                    Kayıtlı müstahsil bulunamadı.
                  </td>
                </tr>
              ) : (
                contractors.map((contractor) => (
                  <tr key={contractor.id}>
                    <td>{contractor.id}</td>
                    <td className="fw-bold text-dark">{contractor.companyName}</td>
                    <td>{contractor.taxNumber || "-"}</td>
                    <td>{contractor.relevantPerson}</td>
                    <td>{contractor.contactNumber}</td>
                    <td>{contractor.email || "-"}</td>
                    <td className="text-truncate" style={{maxWidth: '200px'}} title={contractor.address}>
                        {contractor.address}
                    </td>
                    
                    {/* İşlem Butonları */}
                    <td className="text-center">
                      <div className="btn-group" role="group">
                        <button
                            className="btn btn-sm btn-outline-info"
                            title="Detaylar / Cari"
                            // onClick={() => navigate(`/contractor-account/${contractor.id}`)} // İleride eklersin
                        >
                            <i className="bi bi-eye-fill"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-outline-warning"
                            title="Düzenle"
                            // onClick={() => handleEdit(contractor)} // İleride eklersin
                        >
                            <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            title="Sil"
                            onClick={() => handleShowDeleteModal(contractor)}
                            disabled={isDeleting}
                        >
                            <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🎨 SİLME ONAY MODALI */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton className="modal-header-fistik">
          <Modal.Title>Müstahsili Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Emin misiniz?{" "}
          <strong className="modal-product-name">
            {selectedContractor?.companyName}
          </strong>{" "}
          adlı müstahsil kaydını silmek üzeresiniz.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn-fistik-secondary"
            onClick={handleCloseDeleteModal}
            disabled={isDeleting}
          >
            İptal
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Siliniyor..." : "Evet, Sil"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ContractorList;