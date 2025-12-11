import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../../services/userService";
import type { UserModel } from "../../models/userModel";
import "../css/Modal.css";
import "../css/Forms.css";

interface UserEditModalProps {
  show: boolean;
  handleClose: () => void;
  user: UserModel | null;
}

function UserEditModal({ show, handleClose, user }: UserEditModalProps) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [formData, setFormData] = useState<Partial<UserModel>>({
    firstName: "",
    lastName: "",
    title: "",
    phoneNumber: "",
    email: "",
    status: true,
  });

  useEffect(() => {
    if (user && show) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        phoneNumber: user.phoneNumber,
        email: user.email,
        status: user.status,
      });
    }
  }, [user, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      toast.error("Ad ve soyad alanları zorunludur!");
      return;
    }

    try {
      await updateUser({
        id: user.id,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        title: formData.title || "",
        phoneNumber: formData.phoneNumber || "",
        email: formData.email || "",
        status: formData.status ?? true,
      }).unwrap();
      toast.success("Kullanıcı başarıyla güncellendi!");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-person-gear me-2"></i>Personeli Düzenle
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Ad</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Soyad</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Unvan / Yetki</Form.Label>
            <Form.Select
              name="title"
              value={formData.title}
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="Yönetici">Yönetici</option>
              <option value="Satışçı">Satışçı</option>
              <option value="Kavurmacı">Kavurmacı</option>
              <option value="Paketleyici">Paketleyici</option>
              <option value="Çalışan">Çalışan</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Telefon</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="05XX XXX XX XX"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">E-Posta</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Durum</Form.Label>
            <Form.Select
              name="status"
              value={formData.status?.toString()}
              onChange={handleChange}
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          İptal
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-1"></i>Kaydet
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserEditModal;
