import { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";

import { useAddContractorProductMutation } from "../../services/contractorProductService";
import { useGetContractorsQuery } from "../../services/contractorService";
import type { ContractorProductModel } from "../../models/contractorProductModel";
import { formatNumber } from "../../utilities/formatters";

import "../css/Forms.css";
import "../css/Modal.css"; // Dosya adı Modals.css ise

interface SendModalProps {
  show: boolean;
  handleClose: () => void;
  product: any;
  sourceType: "Fasoncu" | "Komisyoncu";
}

function SendToContractorModal({ show, handleClose, product, sourceType }: SendModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [contractorId, setContractorId] = useState<number>(0);

  const { data: contractorsData, isLoading: isLoadingContractors } = useGetContractorsQuery();
  const [addContractorProduct, { isLoading }] = useAddContractorProductMutation();

  useEffect(() => {
    if (show) {
      setAmount(0);
      setContractorId(0);
    }
  }, [show]);

  const contractorOptions = useMemo(() => {
    if (!contractorsData?.data) return [];
    
    return contractorsData.data.map((c: any) => ({
      value: c.id,
      // 👇 Burayı da garantiye aldım, hepsi varsa sırayla dener
      label: c.companyName || c.contractorName || c.name || "İsimsiz Firma"
    }));
  }, [contractorsData]);

  // 🔥 İŞTE SİHİRLİ DOKUNUŞ BURADA 🔥
  const fistikSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? '#6B8E23' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(107, 142, 35, 0.25)' : null,
      '&:hover': { borderColor: '#6B8E23' },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#6B8E23' : state.isFocused ? '#F8F8DC' : null,
      color: state.isSelected ? 'white' : '#8B4513',
    }),
    // 👇 BU AYAR ÇOK ÖNEMLİ: Menüyü Modal'ın üzerine çıkartır!
    menuPortal: (base: any) => ({ 
        ...base, 
        zIndex: 9999 // Bootstrap Modal genelde 1055 civarıdır, biz 9999 ile eziyoruz!
    })
  };

  const handleSubmit = async () => {
    if (!product || contractorId === 0 || amount <= 0) {
      toast.warn("Lütfen bir muhatap seçin ve geçerli miktar girin.");
      return;
    }

    // Stok kontrolü (Farklı isimlendirmelere karşı önlem)
    const currentStock = product.amount || product.incomingAmount || product.unitsInStock || 0;

    if (amount > currentStock) {
      toast.error(`Stok yetersiz! Mevcut: ${formatNumber(currentStock)}`);
      return;
    }

    try {
      const payload: ContractorProductModel = {
        id: 0,
        contractorId: contractorId,
        productId: product.id || product.productId || 0, // ID kontrolü
        amount: amount,
        shippedDate: new Date().toISOString(),
      };

      await addContractorProduct(payload).unwrap();
      
      toast.success(`"${product.productName || product.name}" başarıyla gönderildi!`);
      handleClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Gönderme işlemi başarısız oldu.");
    }
  };

  return (
    // 💡 overflow sorununu çözmek için Modal'a stil ekleyebiliriz ama gerek kalmamalı
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-truck me-2"></i>
          {sourceType}'ya Ürün Gönder
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: 'visible' }}> {/* 💡 Ekstra güvenlik: Taşmaya izin ver */}
        <div className="alert alert-light border-success mb-3">
            <strong>Gönderilen Ürün:</strong> {product?.productName || product?.name} <br/>
            <strong>Mevcut Stok:</strong> {formatNumber(product?.amount || product?.incomingAmount)}
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{sourceType} Seçiniz</Form.Label>
            
            <Select
                options={contractorOptions}
                onChange={(opt: any) => setContractorId(opt?.value)}
                placeholder={isLoadingContractors ? "Listeleniyor..." : `${sourceType} Ara...`}
                styles={fistikSelectStyles}
                
                // 👇 BU İKİSİ BİRLİKTE OLMAZSA ÇALIŞMAZ
                menuPortalTarget={document.body} 
                menuPosition={'fixed'} 
                
                noOptionsMessage={() => "Kayıt bulunamadı"}
                isLoading={isLoadingContractors}
                isClearable
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Gönderilecek Miktar</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              min="1"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className="btn-fistik-secondary" onClick={handleClose}>
          İptal
        </Button>
        <Button variant="primary" className="btn-fistik-primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Gönderiliyor..." : "Onayla ve Gönder"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SendToContractorModal;