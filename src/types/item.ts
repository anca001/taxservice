export interface Item {
  itemId: string;
  cost: number;
  taxRate: number;
}

export interface AmendSale extends Item {
  date: string;
  invoiceId: string;
}

export interface EnrichedAmendSale extends AmendSale {
  totalTax: number;
  timestamp: number;
}
