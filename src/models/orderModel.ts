export interface OrderModel {
  customerId: number;
  employeeId: number;
  orderDate: Date;
  lines: [
    {
      productId: string;
      unitPrice: number;
      amount: number;
      taxRate: number;
      taxAmount: number;
      totalPrice: number;
      maturityDay: number;
      maturityDate: Date;
      dolarRate: number;
      euroRate: number;
      taxTotalPrice: number;
    }
  ];
}
