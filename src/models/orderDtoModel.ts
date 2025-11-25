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
  isPayment: boolean;
}
