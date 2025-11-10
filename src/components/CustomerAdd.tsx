import { useState } from "react";
import { useAddCustomerMutation } from "../services/customerService";
import Layout from "../components/Layout";

function CustomerAdd() {
  const [addCustomer] = useAddCustomerMutation();

  const [formData, setFormData] = useState({
    customerName: "",
    taxNumber: "",
    relevantPerson: "",
    contactNumber: "",
    address: "",
    contactMail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addCustomer(formData).unwrap();
      alert(result.message || "Müşteri başarıyla eklendi!");
      setFormData({
        customerName: "",
        taxNumber: "",
        relevantPerson: "",
        contactNumber: "",
        address: "",
        contactMail: "",
      });
    } catch (error) {
      alert("Müşteri eklenemedi, API kontrol et reis 😔");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Yeni Müşteri Ekle</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Müşteri Adı</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Vergi Numarası</label>
                <input
                  type="text"
                  className="form-control"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">İletişim Kişisi</label>
                <input
                  type="text"
                  className="form-control"
                  name="relevantPerson"
                  value={formData.relevantPerson}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Telefon</label>
                <input
                  type="text"
                  className="form-control"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Adres</label>
              <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">E-Posta</label>
              <input
                type="email"
                className="form-control"
                name="contactMail"
                value={formData.contactMail}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              <i className="bi bi-save me-2"></i> Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerAdd;
