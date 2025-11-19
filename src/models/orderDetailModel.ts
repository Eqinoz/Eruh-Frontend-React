import type { OrderModel } from "./orderModel";

export interface OrderDetailModel {
  id?: number;
  orderId: number;
  productId: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
  maturityDay: number;
  meturityDate: Date;
  dolarRate: number;
  euroRate: number;
  taxTotalPrice: number;
  order: OrderModel;
}
