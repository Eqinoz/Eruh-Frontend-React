import { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";

// --- SERVİSLER ---
import { useAddContractorProductMutation } from "../../services/contractorProductService";
import { useGetContractorsQuery } from "../../services/contractorService";
// 👇 STOKTAN DÜŞMEK İÇİN GEREKLİ SERVİSLER EKLENDİ
import { useUpdateProcessedProductMutation } from "../../services/processedProductService";
import { useUpdateProductMutation } from "../../services/productService";

import type { ContractorProductModel } from "../../models/contractorProductModel";
import { formatNumber } from "../../utilities/formatters";

import "../css/Forms.css";
import "../css/Modal.css";

interface SendModalProps {
  show: boolean;
  handleClose: () => void;
  product: any;
  sourceType: "Fasoncu" | "Komisyoncu";
}

function SendToContractorModal({ show, handleClose, product, sourceType }: SendModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [contractorId, setContractorId] = useState<number>(0);

  // --- API HOOK'LARI ---
  const { data: contractorsData, isLoading: isLoadingContractors } = useGetContractorsQuery();
  const [addContractorProduct, { isLoading: isAdding }] = useAddContractorProductMutation();
  
  // 👇 STOK GÜNCELLEME HOOK'LARI
  const [updateProcessedProduct, { isLoading: isUpdatingProcessed }] = useUpdateProcessedProductMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();

  // Tüm yükleme durumlarını birleştir (Butonu kilitlemek için)
  const isLoading = isAdding || isUpdatingProcessed || isUpdatingProduct;

  useEffect(() => {
    if (show) {
      setAmount(0);
      setContractorId(0);
    }
  }, [show]);

  // Options Memoization
  const contractorOptions = useMemo(() => {
    if (!contractorsData?.data) return [];
    
    return contractorsData.data.map((c: any) => ({
      value: c.id,
      label: c.companyName || c.contractorName || c.name || "İsimsiz Firma"
    }));
  }, [contractorsData]);

  // Select Stilleri
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
    menuPortal: (base: any) => ({ 
        ...base, 
        zIndex: 9999 
    })
  };

  const handleSubmit = async () => {
    if (!product || contractorId === 0 || amount <= 0) {
      toast.warn("Lütfen bir muhatap seçin ve geçerli miktar girin.");
      return;
    }

    const currentStock = product.amount || 0;

    if (amount > currentStock) {
      toast.error(`Stok yetersiz! Mevcut: ${formatNumber(currentStock)}`);
      return;
    }

    try {
      // 1. MALI MÜSTAHSİLE GÖNDER (KAYIT AT)
      const payload: ContractorProductModel = {
        id: 0,
        contractorId: contractorId,
        productId: product.id!,
        amount: amount,
        shippedDate: new Date().toISOString(),
      };

      await addContractorProduct(payload).unwrap();

      // 2. STOKTAN DÜŞ (KAYNAĞA GÖRE)
      const newStockAmount = currentStock - amount;

      if (sourceType === "Fasoncu") {
        // İşlenmiş Ürün Stoğunu Güncelle
        // product objesini kopyala, amount'u güncelle
        const updatedProcessedProduct = { ...product, amount: newStockAmount };
        await updateProcessedProduct(updatedProcessedProduct).unwrap();

      } else if (sourceType === "Komisyoncu") {
        // Satışa Hazır Ürün Stoğunu Güncelle
        // product objesini kopyala, amount'u güncelle
        const updatedProduct = { ...product, amount: newStockAmount };
        await updateProduct(updatedProduct).unwrap();
      }
      
      toast.success(`"${product.productName || product.name}" başarıyla gönderildi ve stoktan düşüldü!`);
      handleClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "İşlem sırasında bir hata oluştu.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-fistik">
        <Modal.Title>
          <i className="bi bi-truck me-2"></i>
          {sourceType}'ya Ürün Gönder
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: 'visible' }}>
        <div className="alert alert-light border-success mb-3">
            <strong>Gönderilen Ürün:</strong> {product?.productName || product?.name} <br/>
            <strong>Mevcut Stok:</strong> {formatNumber(product?.amount)}
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{sourceType} Seçiniz</Form.Label>
            <Select
                options={contractorOptions}
                onChange={(opt: any) => setContractorId(opt?.value)}
                placeholder={isLoadingContractors ? "Listeleniyor..." : `${sourceType} Ara...`}
                styles={fistikSelectStyles}
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
          {isLoading ? "İşleniyor..." : "Onayla ve Gönder"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SendToContractorModal;