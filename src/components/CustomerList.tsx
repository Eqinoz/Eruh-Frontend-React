import {
  useGetCustomersQuery,
  useDeleteCustomerMutation,
} from "../services/customerService";
// 🎨 1. Gerekli importları ekledim
import "./css/RawMaterialList.css"; // Ana tema için
import "./css/Modal.css"; // Modal teması için
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import type { CustomerModel } from "../models/customerModel";
import CustomerEditModal from "./modals/CustomerEditModal";
import AddDebtModal from "./modals/AddDebtModal";
import { Link } from "react-router-dom";


function CustomerList() {
  const [showModal, setShowModal] = useState(false);

  // 🎨 2. 'isError' ve 'data'yı 'customersResponse' olarak yeniden adlandırdım (daha net)
  const {
    data: customersResponse,
    isLoading,
    isError,
  } = useGetCustomersQuery();

  // 🎨 3. Silme işlemi için 'isLoading' (isDeleting) durumunu aldım
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  // 🎨 4. Onay Modalı için state'ler
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerModel | null>(null);

  // 🔹 Devir borç modal state'i
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [debtCustomer, setDebtCustomer] = useState<CustomerModel | null>(null);

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };

  const handleShowDeleteModal = (customer: CustomerModel) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  // 🎨 5. 'window.confirm' yerine 'toastify'lı, 'async' modal silme
  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      await deleteCustomer(selectedCustomer.id).unwrap();
      toast.success(
        `"${selectedCustomer.customerName}" adlı müşteri başarıyla silindi.`
      );
      handleCloseDeleteModal();
    } catch (err: any) {
      toast.error(err.data?.message || "Silme işlemi başarısız oldu.");
    }
  };

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;

  // 🎨 6. 'isError' kontrolü eklendi
  if (isError)
    return <div className="text-danger text-center mt-5">Veri alınamadı!</div>;

  const customers = customersResponse?.data ?? [];

  return (
    // 🎨 7. Layout 'container-fluid' yapıldı
    <>
      <div className="card shadow-lg border-0">
        {/* 🎨 8. Tema: Kart başlığı ve ikonu güncellendi */}
        <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-people-fill me-2"></i>Müşteri Listesi
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            {/* 🎨 9. Tema: Tablo başlığı güncellendi */}
            <thead className="thead-fistik">
              <tr>
                <th>ID</th>
                <th>Müşteri Adı</th>
                <th>Vergi No</th>
                <th>İlgili Kişi</th>
                <th>Telefon</th>
                <th>Adres</th>
                <th>E-Posta</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {/* 🎨 10. Boş Liste Kontrolü eklendi */}
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    Müşteri bulunamadı
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.customerName}</td>
                    <td>{customer.taxNumber}</td>
                    <td>{customer.relevantPerson}</td>
                    <td>{customer.contactNumber}</td>
                    <td>{customer.address}</td>
                    <td>{customer.contactMail}</td>

                    {/* 🎨 11. İşlem butonları güncellendi ve eklendi */}
                    <td>
                      <Link
                        to={`/customer-detail/${customer.id}`}
                        className="btn btn-sm btn-outline-info me-2"
                        title="Müşteri Detayları / Cari"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </Link>

                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        title="Düzenle"
                        onClick={() => {
                          setShowModal(true);
                          setSelectedCustomer(customer);
                        }}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        title="Devir Borç Ekle"
                        onClick={() => {
                          setDebtCustomer(customer);
                          setShowDebtModal(true);
                        }}
                      >
                        <i className="bi bi-cash-stack"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Sil"
                        onClick={() => handleShowDeleteModal(customer)}
                        disabled={isDeleting}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <CustomerEditModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        customer={selectedCustomer}
      />

      {/* 🔹 Devir Borç Modal */}
      <AddDebtModal
        show={showDebtModal}
        handleClose={() => setShowDebtModal(false)}
        customer={debtCustomer}
      />

      {/* 🎨 12. "Sil" Onay Modalı */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton className="modal-header-fistik">
          <Modal.Title>Müşteriyi Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Emin misiniz?{" "}
          <strong className="modal-product-name">
            {selectedCustomer?.customerName}
          </strong>{" "}
          adlı müşteriyi kalıcı olarak silmek üzeresiniz. Bu işlem geri
          alınamaz.
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
            variant="danger" // 👈 Silme onayı için 'danger' (kırmızı)
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Siliniyor..." : "Evet, Sil"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomerList;
