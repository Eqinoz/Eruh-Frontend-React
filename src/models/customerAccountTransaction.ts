import type { OrderDtoModel } from "./orderDtoModel";

export interface CustomerAccountTransaction {
  id: number;
  customerName: string;
  relevantPerson: string;
  address: string;
  contactNumber: string;
  orderDetail: OrderDtoModel[];
}
