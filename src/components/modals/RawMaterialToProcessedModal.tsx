import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useAddProductToProcessedMutation } from "../../services/productToProcessedService";
import type { RawMaterial } from "../../models/rawMaterialModel";
import { useUpdateRawMaterialMutation } from "../../services/rawMaterialService";
import type { ProductToProcessed } from "../../models/productToProcessed";
import { toast } from "react-toastify";
import "../css/Modal.css";
import { formatNumber } from "../../utilities/formatters";

interface RawMaterialToProcessedModalProps {
  show: boolean;
  handleClose: () => void;
  product: any; // Bu 'any' kalabilir, çünkü backend'den gelen tutarsız
}

function RawMaterialToProcessedModal({
  show,
  handleClose,
  product,
}: RawMaterialToProcessedModalProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  // 2. 'error' state'i ve 'Alert' artık GEREKLİ DEĞİL.
  // const [error, setError] = useState<string | null>(null);

  const [addProductToProcessed, { isLoading: isAdding }] =
    useAddProductToProcessedMutation();
  const [updateRawMaterial, { isLoading: isUpdating }] =
    useUpdateRawMaterialMutation();

  useEffect(() => {
    if (show && product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setAmount(0);
      // setError(null); // Gerek kalmadı
    }
  }, [show, product]);

  const handleSubmit = async () => {
    // setError(null); // Gerek kalmadı
    if (!product) return;
    if (!name || amount <= 0) {
      toast.error("Lütfen isim ve geçerli miktar girin.");
      return;
    }
    try {
      const originalIncoming = product?.incomingAmount ?? 0;
      const originalNeighborhoodIncoming =
        (product as any).neighborhoodIncomingAmount ??
        (product as any).neighborhoodInComingAmount ??
        0;

      if (amount > originalIncoming) {
        toast.error(
          `Siirt stoğunda yalnızca ${originalIncoming} adet var. Fazlasını gönderemezsiniz.`
        );
        return;
      }

      // Not: Bu modal, sadece 'Siirt Stoğundan' ('incomingAmount') düşüyor.
      // Mahalle stoğundan ('neighborhoodInComingAmount') düşmüyor.
      // Eğer oradan da düşmesi gerekiyorsa, 'if' kontrolü ve
      // 'updatedAny' objesi güncellenmeli.

      const updatedAny: any = {
        id: product.id,
        name: name,
        description: description,
        incomingAmount: originalIncoming - amount,
        neighborhoodInComingAmount: originalNeighborhoodIncoming,
        neighborhoodIncomingAmount: originalNeighborhoodIncoming, // İki türlü de yolla
      };

      await updateRawMaterial(updatedAny as RawMaterial).unwrap();

      const newproductToProcessed: ProductToProcessed = {
        id: 0,
        productName: name,
        description: description,
        amount: amount,
        dateAdded: new Date().toISOString(),
      };
      await addProductToProcessed(newproductToProcessed).unwrap();

      toast.success(`${amount} kg ürün işleme başarıyla gönderildi!`);
      handleClose();
    } catch (err: any) {
      console.error("Processed product add error:", err);
      toast.error(err.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    // 'product' objesi yoksa modal'ı render etme (güvenlik önlemi)
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          İşleme Gönder:{" "}
          <span className="modal-product-name">{product?.name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Ürün Adı (İşlendikten Sonraki)</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Siirt Stoğundan Alınacak Miktar (Stok:{" "}
              {formatNumber(product?.incomingAmount)})
            </Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={product?.incomingAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </Form.Group>

          {/* 'Alert' component'i buradan kaldırıldı */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
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
          {isUpdating || isAdding ? "Gönderiliyor..." : "İşleme Gönder"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RawMaterialToProcessedModal;
