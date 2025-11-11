import { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import type { Neighborhood } from "../models/neigborhoodModel";
import type { ProcessedProduct } from "../models/processedProductModel";
import { useAddProcessedProductMutation } from "../services/processedProductService";
import { useDeleteNeighborhoodMutation } from "../services/neighborhoodService";

interface Props {
  show: boolean;
  handleClose: () => void;
  neighborhood: Neighborhood | null;
}

function NeighborhoodProcessModal({ show, handleClose, neighborhood }: Props) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [addProcessedProduct, { isLoading: isAdding }] =
    useAddProcessedProductMutation();
  const [deleteNeighborhood, { isLoading: isDeleting }] =
    useDeleteNeighborhoodMutation();

  useEffect(() => {
    if (show && neighborhood) {
      setName(neighborhood.productName || "");
      setDescription(neighborhood.productDescription || "");
      setAmount(neighborhood.amount || 0);
      setError(null);
    }
  }, [show, neighborhood]);

  const handleSubmit = async () => {
    setError(null);
    if (!neighborhood || neighborhood.id === undefined) return;
    if (!name || amount <= 0) {
      setError("Lütfen isim ve geçerli miktar girin.");
      return;
    }

    const payload: ProcessedProduct = {
      id: 0,
      productName: name,
      description: description,
      amount: amount,
      inComingFrom: "Mahalle",
    };

    try {
      // 1) add to processed products
      await addProcessedProduct(payload).unwrap();

      // 2) delete the neighborhood entry
      await deleteNeighborhood(neighborhood.id).unwrap();

      handleClose();
    } catch (err) {
      // RTK Query throws a serialized error object. Log it and show useful info to the user.
      console.error("Processed product / delete error:", err);
      const e = err as any;

      // Prefer server-provided message or serialized data
      if (e?.data) {
        // e.data can be string or object
        const msg =
          typeof e.data === "string" ? e.data : JSON.stringify(e.data);
        setError(`Sunucu hatası: ${msg}`);
      } else if (e?.status) {
        setError(`Sunucu hatası: ${e.status}`);
      } else if (e?.message) {
        setError(e.message as string);
      } else {
        setError("İşlem başarısız oldu. Tekrar deneyin.");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>İşlemi Tamamla</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Ürün Adı</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Açıklama</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Miktar</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          İptal
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isAdding || isDeleting}
        >
          {isAdding || isDeleting ? "İşleniyor..." : "İşlemi Tamamla"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NeighborhoodProcessModal;
