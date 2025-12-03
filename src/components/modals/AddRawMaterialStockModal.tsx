import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUpdateRawMaterialMutation } from "../../services/rawMaterialService";
import type { RawMaterial } from "../../models/rawMaterialModel";
import { formatNumber } from "../../utilities/formatters";
import "../css/Forms.css";
import "../css/Modal.css";

interface AddStockModalProps {
  show: boolean;
  handleClose: () => void;
  product: RawMaterial | null;
}

function AddStockModal({ show, handleClose, product }: AddStockModalProps) {
  const [amountToAdd, setAmountToAdd] = useState<number>(0);
  const [updateRawMaterial, { isLoading }] = useUpdateRawMaterialMutation();

  useEffect(() => {
    if (show) {
      setAmountToAdd(0); // Modal açılınca inputu sıfırla
    }
  }, [show]);

  const handleSubmit = async () => {
    if (!product) return;

    if (amountToAdd <= 0) {
      toast.warn("Lütfen geçerli bir miktar girin.");
      return;
    }

    try {
      // 🧠 MANTIK: Mevcut stok + Yeni eklenen miktar
      const newIncomingAmount = product.incomingAmount + amountToAdd;

      // Güncellenecek obje (Diğer alanları koru, sadece incomingAmount'u değiştir)
      const updatedProduct: RawMaterial = {
        ...product,
        incomingAmount: newIncomingAmount,
      };

      await updateRawMaterial(updatedProduct).unwrap();

      toast.success(`Stok başarıyla güncellendi! (+${amountToAdd} kg)`);
      handleClose();
    } catch (err: any) {
      console.error("Stok ekleme hatası:", err);
      toast.error("Stok güncellenirken bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Hızlı Stok Ekle
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-light border-success mb-3">
            <strong>Ürün:</strong> {product?.name} <br/>
            <strong>Mevcut Siirt Stoku:</strong> {formatNumber(product?.incomingAmount)} kg
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold text-success">Eklenecek Miktar (kg)</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => setAmountToAdd(Number(e.target.value))}
              placeholder="0"
              min="1"
              autoFocus
              className="border-success" // Yeşil çerçeve
            />
            <Form.Text className="text-muted">
               * Bu miktar mevcut stoğun üzerine eklenecektir.
            </Form.Text>
          </Form.Group>
          
          {/* Hesaplama Önizlemesi */}
          <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded border">
              <span>Yeni Toplam Stok Olacak:</span>
              <span className="fw-bold text-success fs-5">
                  {formatNumber((product?.incomingAmount || 0) + amountToAdd)} kg
              </span>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className="btn-fistik-secondary" onClick={handleClose}>
          İptal
        </Button>
        <Button 
            variant="success" // Yeşil buton
            className="btn-fistik-primary" 
            onClick={handleSubmit} 
            disabled={isLoading}
        >
          {isLoading ? "Güncelleniyor..." : "Onayla ve Ekle"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddStockModal;