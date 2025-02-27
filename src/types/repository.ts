import {
  EnrichedSale,
  EnrichedTaxPayment,
  EnrichedTransaction,
} from "./events";
import { Item } from "./item";

export interface TransactionRepository {
  addTransaction(transaction: EnrichedTransaction): void;
  addItemToTransaction(invoiceId: string, newItem: Item): void;
  updateItem(
    invoiceId: string,
    itemId: string,
    newItemCost: number,
    newItemTaxRate: number,
  ): void;
  getAllTransactions(): EnrichedTransaction[];
  getSales(): EnrichedSale[];
  getTaxPayments(): EnrichedTaxPayment[];
}
