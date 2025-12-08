import type { OrderDtoModel } from "./orderDtoModel";
import type { FinancialTransaction } from "./financialTransactionModel";

export interface CustomerAccountTransaction {
  id: number;
  customerName: string;
  relevantPerson: string;
  address: string;
  contactNumber: string;
  openingBalance: number;       // Açılış bakiyesi (devreden borç)
  totalOrderAmount: number;     // Toplam sipariş tutarı
  totalPaymentAmount: number;   // Toplam ödeme tutarı
  currentBalance: number;       // Güncel bakiye
  financialTransactions: FinancialTransaction[];  // Finansal işlemler
  orderDetail: OrderDtoModel[];
}
