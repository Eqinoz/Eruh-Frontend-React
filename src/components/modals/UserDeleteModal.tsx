import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDeleteUserMutation } from "../../services/userService";
import type { UserModel } from "../../models/userModel";
import "../css/Modal.css";

interface UserDeleteModalProps {
  show: boolean;
  handleClose: () => void;
  user: UserModel | null;
}

function UserDeleteModal({ show, handleClose, user }: UserDeleteModalProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUser(user.id).unwrap();
      toast.success("Kullanıcı başarıyla silindi!");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Silme sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <i className="bi bi-exclamation-triangle me-2"></i>Personeli Sil
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-3">
          <i className="bi bi-person-x text-danger" style={{ fontSize: "3rem" }}></i>
          <h5 className="mt-3">Bu personeli silmek istediğinize emin misiniz?</h5>
          {user && (
            <div className="alert alert-secondary mt-3 text-start">
              <p className="mb-1">
                <strong>Ad Soyad:</strong> {user.firstName} {user.lastName}
              </p>
              <p className="mb-1">
                <strong>Unvan:</strong> {user.title}
              </p>
              <p className="mb-0">
                <strong>E-Posta:</strong> {user.email}
              </p>
            </div>
          )}
          <p className="text-muted small">Bu işlem geri alınamaz!</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          İptal
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Siliniyor...
            </>
          ) : (
            <>
              <i className="bi bi-trash me-1"></i>Sil
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserDeleteModal;
