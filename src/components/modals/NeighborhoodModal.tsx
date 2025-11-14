import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAddNeighborhoodMutation } from "../../services/neighborhoodService";
import { useUpdateRawMaterialMutation } from "../../services/rawMaterialService";
import type { RawMaterial } from "../../models/rawMaterialModel";
import { formatNumber } from "../../utilities/formatters";
import { toast } from "react-toastify";
import "../css/Modal.css";

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
  // 2. 'error' state'i ve 'Alert' artık GEREKLİ DEĞİL.
  // const [error, setError] = useState<string | null>(null);

  const [updateRawMaterial, { isLoading: isUpdating }] =
    useUpdateRawMaterialMutation();
  const [addNeighborhood, { isLoading: isAdding }] =
    useAddNeighborhoodMutation();

  useEffect(() => {
    if (show) {
      setAmount(0);
      setDescription(""); // Açıklamayı da sıfırla
      // setError(null); // Gerek kalmadı
    }
  }, [show]);

  const handleSubmit = async () => {
    // setError(null); // Gerek kalmadı
    const sendAmount = amount;

    // --- Doğrulama (Validation) ---
    if (!product) return;
    if (isNaN(sendAmount) || sendAmount <= 0) {
      // 3. 'setError' yerine 'toast.error' kullan
      toast.error("Lütfen geçerli bir miktar girin.");
      return;
    }
    if (sendAmount > product.incomingAmount) {
      toast.error(
        `Stokta ${product.incomingAmount} adet var. Fazlasını gönderemezsiniz.`
      );
      return;
    }

    try {
      const updatedRawMaterial: RawMaterial = {
        ...product,
        incomingAmount: product.incomingAmount - amount,
      } as RawMaterial;

      await updateRawMaterial(updatedRawMaterial).unwrap();

      const neighborhoodPayload = {
        id: 0,
        productType: "Ham Madde",
        productName: product.name,
        productDescription: description,
        amount: amount,
      };

      await addNeighborhood(neighborhoodPayload).unwrap();

      // 4. Başarı mesajı göster
      toast.success(
        `${product.name} ürününden ${amount} kg mahalleye başarıyla gönderildi!`
      );
      handleClose(); // Modal'ı kapat
    } catch (err: any) {
      // 5. Hata mesajı göster
      console.error(err);
      toast.error(
        err.data?.message || "İşlem başarısız oldu. Lütfen tekrar deneyin."
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* 6. Modal başlığına tema sınıfını ekle */}
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          Mahalleye Gönder: {/* 7. Ürün adına özel sınıf ekle */}
          <span className="modal-product-name">{product?.name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Mevcut Stok:{" "}
              <strong>{formatNumber(product?.incomingAmount)}</strong> kilo
            </Form.Label>
            <Form.Label className="d-block mt-2">
              Gönderilecek Miktar
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              max={product?.incomingAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              autoFocus
            />
            <Form.Label className="d-block mt-2">
              Yapılacak İşlem (Açıklama)
            </Form.Label>
            <Form.Control
              type="text"
              value={description} // 'value' prop'unu ekledim
              onChange={(e) => setDescription(e.target.value)} // 'String'e gerek yok
              placeholder="Mahallede Yapılacak İşlem"
            />
          </Form.Group>

          {/* 8. 'Alert' component'i buradan kaldırıldı */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* 9. Butonlara yeni stil sınıflarını ekle */}
        <Button
          variant="secondary"
          className="btn-fistik-secondary"
          onClick={handleClose}
        >
          İptal
        </Button>
        <Button
          variant="primary"
          className="btn-fistik-primary"
          onClick={handleSubmit}
          disabled={isUpdating || isAdding}
        >
          {isUpdating || isAdding ? "Gönderiliyor..." : "Gönder"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NeighborhoodSendModal;
