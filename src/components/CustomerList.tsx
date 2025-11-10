import Layout from "../components/Layout";
import {
  useGetCustomersQuery,
  useDeleteCustomerMutation,
} from "../services/customerService";

function CustomerList() {
  const { data, isLoading } = useGetCustomersQuery();
  const [deleteCustomer] = useDeleteCustomerMutation();

  if (isLoading) return <div className="text-center mt-5">Yükleniyor...</div>;

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu müşteriyi silmek istediğine emin misin?")) {
      await deleteCustomer(id);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Müşteri Listesi</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Müşteri Adı</th>
                <th>Vergi No</th>
                <th>İlgili Kişi</th>
                <th>Telefon</th>
                <th>E-Posta</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.customerName}</td>
                  <td>{customer.taxNumber}</td>
                  <td>{customer.relevantPerson}</td>
                  <td>{customer.contactNumber}</td>
                  <td>{customer.contactMail}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(customer.id!)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerList;
