import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDeleteOpeningBalanceMutation } from "../../services/customerService";
import type { FinancialTransaction } from "../../models/financialTransactionModel";
import { formatNumber, formatDate } from "../../utilities/formatters";
import "../css/Modal.css";

interface FinancialTransactionDeleteModalProps {
  show: boolean;
  handleClose: () => void;
  transaction: FinancialTransaction | null;
}

function FinancialTransactionDeleteModal({
  show,
  handleClose,
  transaction,
}: FinancialTransactionDeleteModalProps) {
  const [deleteTransaction, { isLoading }] = useDeleteOpeningBalanceMutation();

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      await deleteTransaction(transaction.id).unwrap();
      toast.success("Finansal işlem başarıyla silindi!");
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Silme sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <i className="bi bi-exclamation-triangle me-2"></i>İşlemi Sil
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-3">
          <i className="bi bi-trash text-danger" style={{ fontSize: "3rem" }}></i>
          <h5 className="mt-3">Bu işlemi silmek istediğinize emin misiniz?</h5>
          {transaction && (
            <div className="alert alert-secondary mt-3 text-start">
              <p className="mb-1">
                <strong>Tarih:</strong> {formatDate(transaction.date)}
              </p>
              <p className="mb-1">
                <strong>Açıklama:</strong> {transaction.description}
              </p>
              <p className="mb-0">
                <strong>Tutar:</strong>{" "}
                <span className={transaction.isDebt ? "text-danger" : "text-success"}>
                  {transaction.isDebt ? "+" : "-"}{formatNumber(transaction.amount)} ₺
                </span>
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

export default FinancialTransactionDeleteModal;
