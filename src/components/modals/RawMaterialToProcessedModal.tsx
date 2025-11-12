import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useAddProductToProcessedMutation } from "../../services/productToProcessedService";
import type { RawMaterial } from "../../models/rawMaterialModel";
import { useUpdateRawMaterialMutation } from "../../services/rawMaterialService";
import type { ProductToProcessed } from "../../models/productToProcessed";
import { Alert } from "react-bootstrap";

interface RawMaterialToProcessedModalProps {
  show: boolean;
  handleClose: () => void;
  product: any;
}

function RawMaterialToProcessedModal({
  show,
  handleClose,
  product,
}: RawMaterialToProcessedModalProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [addProductToProcessed, { isLoading: isAdding }] =
    useAddProductToProcessedMutation();
  const [updateRawMaterial, { isLoading: isUpdating }] =
    useUpdateRawMaterialMutation();

  useEffect(() => {
    if (show && product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setAmount(0);
      setError(null);
    }
  }, [show, product]);

  const handleSubmit = async () => {
    setError(null);
    if (!product) return;
    if (!name || amount <= 0) {
      setError("Lütfen isim ve geçerli miktar girin.");
      return;
    }
    try {
      const originalIncoming = product?.incomingAmount ?? 0;
      const originalNeighborhoodIncoming =
        (product as any).neighborhoodIncomingAmount ??
        (product as any).neighborhoodInComingAmount ??
        0;

      if (amount > originalIncoming) {
        setError(`Stokta yalnızca ${originalIncoming} adet var.`);
        return;
      }

      const updatedAny: any = {
        id: product.id,
        name: name,
        description: description,
        incomingAmount: originalIncoming - amount,
        // keep the property the codebase uses
        neighborhoodInComingAmount: originalNeighborhoodIncoming,
      };
      // also set alternate spelling to be safe for other parts of the app
      updatedAny.neighborhoodIncomingAmount = originalNeighborhoodIncoming;

      await updateRawMaterial(updatedAny as RawMaterial).unwrap();

      // 2) Add to processed products
      const newproductToProcessed: ProductToProcessed = {
        id: 0,
        productName: name,
        description: description,
        amount: amount,
        dateAdded: new Date().toISOString(),
      };
      await addProductToProcessed(newproductToProcessed).unwrap();

      handleClose();
    } catch (err) {
      console.error("Processed product add error:", err);
      const e = err as any;
      setError(e.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ham Maddeyi İşleme Gönder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ürün Adı</Form.Label>
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
              <Form.Label>Miktar</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
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
    </>
  );
}

export default RawMaterialToProcessedModal;
