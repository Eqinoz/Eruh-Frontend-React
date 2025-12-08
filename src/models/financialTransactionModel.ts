export interface FinancialTransaction {
  id: number;
  customerId: number;
  date: string;
  amount: number;
  description: string;
  isDebt: boolean; // true = borç, false = ödeme
}

export interface AddOpeningBalanceRequest {
  id?: number;
  customerId: number;
  date: string;
  amount: number;
  description: string;
  isDebt: boolean;
}

// Devir borç ödemesi için request modeli
export interface PayOpeningBalanceRequest {
  customerId: number;
  amount: number;
  description: string;
}

// Devir borç detaylarını listelemek için model (getdetails)
export interface OpeningBalanceDetail {
  id: number;
  customerName: string;
  date: string;
  amount: number;
  description: string;
  totalDevirAmount: number;
  paidAmount: number;
  remainingAmount: number;
  isDebt: boolean;
}


