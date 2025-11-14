import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Neighborhood } from "../../models/neigborhoodModel";
import type { RawMaterial } from "../../models/rawMaterialModel";
import { useUpdateRawMaterialMutation } from "../../services/rawMaterialService";
import { useDeleteNeighborhoodMutation } from "../../services/neighborhoodService";
import { toast } from "react-toastify";
import "../css/Modal.css";

interface Props {
  show: boolean;
  handleClose: () => void;
  neighborhood: Neighborhood | null;
}

function NeighborhoodProcessModal({ show, handleClose, neighborhood }: Props) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  // 2. 'error' state'i ve 'Alert' artık GEREKLİ DEĞİL.
  // const [error, setError] = useState<string | null>(null);

  const [updateRawMaterial, { isLoading: isUpdating }] =
    useUpdateRawMaterialMutation();
  const [deleteNeighborhood, { isLoading: isDeleting }] =
    useDeleteNeighborhoodMutation();

  useEffect(() => {
    if (show && neighborhood) {
      setName(neighborhood.productName || "");
      setDescription(neighborhood.productDescription || "");
      setAmount(neighborhood.amount || 0);
      // setError(null); // Gerek kalmadı
    }
  }, [show, neighborhood]);

  const handleSubmit = async () => {
    // setError(null); // Gerek kalmadı
    if (!neighborhood || neighborhood.id === undefined) return;
    if (!name || amount <= 0) {
      toast.error("Lütfen isim ve geçerli miktar girin.");
      return;
    }

    // 🔴 DİKKAT: CİĞERİM, BURADA MANTIKSAL BİR HATA OLABİLİR!
    // 'updateRawMaterial' hook'unu, 'neighborhood.id' ile çağırıyorsun.
    // Eğer 'Neighborhood' tablosunun ID'si ile 'RawMaterial' tablosunun ID'si
    // aynı değilse (ki muhtemelen değildir), bu kod YANLIŞ HAM MADDEYİ günceller.
    //
    // Bu miktarın, bu 'neighborhood' objesinin geldiği asıl 'RawMaterial' objesine
    // (belki 'neighborhood.rawMaterialId' gibi bir alanla) eklenmesi gerekir.
    // Bu kodu, senin backend mantığına güvendiğim için şimdilik ellemiyorum,
    // sadece 'toast' ekliyorum. Ama burayı KONTROL ETMELİSİN.
    // 🔴 --- UYARI SONU ---

    try {
      const updatedRawMaterial: RawMaterial = {
        id: neighborhood.id, // ⚠️ BURASI MUHTEMELEN HATALI!
        name: name,
        description: description,
        incomingAmount: 0, // ⚠️ Bu, Siirt stoğunu sıfırlar mı?
        neighborhoodInComingAmount: amount, // ⚠️ Sadece mahalle stoğunu günceller?
      };

      await updateRawMaterial(updatedRawMaterial).unwrap();
      await deleteNeighborhood(neighborhood.id).unwrap();

      toast.success("Mahalle işlemi başarıyla tamamlandı!");
      handleClose();
    } catch (err: any) {
      console.error("Raw material update / delete error:", err);
      toast.error(err.data?.message || "İşlem başarısız oldu. Tekrar deneyin.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
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
          disabled={isUpdating || isDeleting}
        >
          {isUpdating || isDeleting ? "İşleniyor..." : "İşlemi Tamamla"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NeighborhoodProcessModal;
