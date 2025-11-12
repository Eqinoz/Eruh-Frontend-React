import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useAddNeighborhoodMutation } from "../../services/neighborhoodService";
import { useUpdateRawMaterialMutation } from "../../services/rawMaterialService";
import type { RawMaterial } from "../../models/rawMaterialModel";
import { formatNumber } from "../../utilities/formatters";

interface NeighborhoodSendModalProps {
  show: boolean;
  handleClose: () => void;
  product: RawMaterial | null;
}

function NeighborhoodSendModal({
  show,
  handleClose,
  product,
}: NeighborhoodSendModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // RTK Query mutation hook'u
  const [updateRawMaterial, { isLoading: isUpdating }] =
    useUpdateRawMaterialMutation();
  const [addNeighborhood, { isLoading: isAdding }] =
    useAddNeighborhoodMutation();

  // Her yeni ürün seçildiğinde (modal açıldığında) input'u sıfırla
  useEffect(() => {
    if (show) {
      setAmount(0);
      setError(null);
    }
  }, [show]);

  // Modal'daki "Gönder" butonuna tıklandığında
  const handleSubmit = async () => {
    setError(null); // Eski hatayı temizle
    const sendAmount = amount;

    // --- Doğrulama (Validation) ---
    if (!product) return; // Ürün yoksa dur
    if (isNaN(sendAmount) || sendAmount <= 0) {
      setError("Lütfen geçerli bir miktar girin.");
      return;
    }
    // En ÖNEMLİ doğrulama: Stoktan fazla gönderilemez
    if (sendAmount > product.incomingAmount) {
      setError(
        `Stokta ${product.incomingAmount} adet var. Fazlasını gönderemezsiniz.`
      );
      return;
    }

    try {
      // 1) Update raw material stock by sending the full object the API expects
      const updatedRawMaterial: RawMaterial = {
        ...product,
        incomingAmount: product.incomingAmount - amount,
      } as RawMaterial;

      await updateRawMaterial(updatedRawMaterial).unwrap();

      // 2) Then add to neighborhood (send neighborhood object)
      const neighborhoodPayload = {
        id: 0, // backend will assign id
        productType: "Ham Madde", // Sabit değer
        productName: product.name,
        productDescription: description,
        amount: amount,
      };

      await addNeighborhood(neighborhoodPayload).unwrap();

      // Close modal on success
      handleClose();
    } catch (err) {
      setError("İşlem başarısız oldu. Lütfen tekrar deneyin.");
      console.error(err);
    }
  };

  return (
    // 'product' objesi yoksa modal'ı render etme (güvenlik önlemi)
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Mahalleye Gönder:{" "}
          <span className="text-primary">{product?.name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Mevcut Stok:{" "}
              <strong>{formatNumber(product?.incomingAmount)}</strong> kilo
            </Form.Label>
            <Form.Label className="d-block">Gönderilecek Miktar</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max={product?.incomingAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              autoFocus
            />
            <Form.Label className="d-block">Yapılacak İşlem</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setDescription(String(e.target.value))}
              placeholder="Mahallede Yapılacak İşlem"
              autoFocus
            />
          </Form.Group>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          İptal
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isUpdating || isAdding} // İşlem sırasındaysa butonu kilitle
        >
          {isUpdating || isAdding ? "Gönderiliyor..." : "Gönder"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NeighborhoodSendModal;
