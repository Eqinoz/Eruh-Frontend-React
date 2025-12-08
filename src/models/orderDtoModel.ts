export interface OrderDtoModel {
  id: number;
  customerName: string;
  employee: string;
  orderDate: string;
  shippedDate: string;
  lines: {
    productName: string;
    unitPrice: number;
    amount: number;
    taxRate: number;
    taxAmount: number;
    totalPrice: number;
    maturityDay: number;
    maturityDate: string;
    dolarRate: number;
    euroRate: number;
    taxTotalPrice: number;
  };
  totalOrderAmount: number;  // Sipariş toplam tutarı
  paidAmount: number;        // Yapılan ödeme tutarı
  remainingAmount: number;   // Kalan borç tutarı
  isPayment: boolean;
}

// Kısmi ödeme için request modeli
export interface PartialPaymentRequest {
  orderId: number;
  amount: number;
  description: string;
  isDebt: boolean;
}
