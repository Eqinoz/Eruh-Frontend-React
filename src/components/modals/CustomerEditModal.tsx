import type { CustomerModel } from "../../models/customerModel";
import { useUpdateCustomerMutation } from "../../services/customerService";
import "../css/Modal.css"; // Modal teması
import "../css/Forms.css"; // Form (input) teması
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { useState, useEffect } from "react"; // 🎨 State hook'ları eklendi
import { toast } from "react-toastify"; // 🎨 Toastify eklendi

interface CustomerEditModalProps {
  show: boolean;
  handleClose: () => void;
  customer: CustomerModel | null; // 🐞 Prop adı 'customer' olmalı
}

function CustomerEditModal({
  show,
  handleClose,
  customer, // 🐞 'customerId' yerine 'customer' objesini aldık
}: CustomerEditModalProps) {
  const [updateCustomerMutation, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  // 🎨 1. Form verilerini tutmak için state
  const [formData, setFormData] = useState<CustomerModel | null>(null);

  // 🎨 2. Modal açıldığında (customer prop'u değiştiğinde) formu doldur
  useEffect(() => {
    if (customer) {
      setFormData(customer);
    } else {
      setFormData(null); // Modal kapanınca veya müşteri yoksa state'i temizle
    }
  }, [customer, show]); // 'show'a da bağlamak iyidir, tekrar açıldığında sıfırlar

  // 🎨 3. Input'lar değiştikçe state'i güncelleyen fonksiyon
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // 🎨 4. "Kaydet" butonuna basınca çalışacak fonksiyon
  const handleSubmit = async () => {
    if (!formData) return;

    try {
      await updateCustomerMutation(formData).unwrap();
      toast.success("Müşteri bilgileri başarıyla güncellendi!");
      handleClose(); // Başarılıysa modalı kapat
    } catch (err: any) {
      toast.error(err.data?.message || "Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    // 🐞 5. 'show' ve 'onHide' prop'ları ana Modal'a bağlandı
    <Modal show={show} onHide={handleClose} centered>
      {/* 🎨 6. Modal başlığı temaya uygun hale getirildi */}
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          Müşteriyi Düzenle:{" "}
          <span className="modal-product-name">{customer?.customerName}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 🎨 7. Form ve input'lar state'e bağlandı */}
        <Form>
          <FormGroup className="mb-3">
            <Form.Label className="fw-bold">Müşteri Adı</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              value={formData?.customerName || ""}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Form.Label>Vergi Numarası</Form.Label>
            <Form.Control
              type="text"
              name="taxNumber"
              value={formData?.taxNumber || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Form.Label>İlgili Kişi</Form.Label>
            <Form.Control
              type="text"
              name="relevantPerson"
              value={formData?.relevantPerson || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Form.Label>İletişim Numarası</Form.Label>
            <Form.Control
              type="text"
              name="contactNumber"
              value={formData?.contactNumber || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Form.Label>Adres</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData?.address || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Form.Label>İletişim Maili</Form.Label>
            <Form.Control
              type="email"
              name="contactMail"
              value={formData?.contactMail || ""}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* 🎨 8. Butonlar temaya uygun hale getirildi ve fonksiyonlar bağlandı */}
        <Button
          variant="secondary"
          className="btn-fistik-secondary"
          onClick={handleClose} // 👈 İptal
          disabled={isUpdating}
        >
          İptal
        </Button>
        <Button
          variant="primary"
          className="btn-fistik-primary" // 👈 "secondy" değil :)
          onClick={handleSubmit} // 👈 Kaydet
          disabled={isUpdating}
        >
          {isUpdating ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomerEditModal;
