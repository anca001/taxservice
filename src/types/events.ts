import { Item } from "./item";
export interface TransactionEvent {
  eventType: "SALES" | "TAX_PAYMENT";
  // The date of the event in ISO 8601 format.
  // Example: “2024-02-22T17:29:39Z”
  date: string;
}

export interface Sale extends TransactionEvent {
  invoiceId: string;
  items: Item[];
}

export interface TaxPayment extends TransactionEvent {
  amount: number;
}

export interface EnrichedSale extends Sale {
  timestamp: number;
  totalTax: number;
}

export interface EnrichedTaxPayment extends TaxPayment {
  timestamp: number;
}

export type EnrichedTransaction = EnrichedSale | EnrichedTaxPayment;
