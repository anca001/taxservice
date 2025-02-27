import {
  EnrichedSale,
  EnrichedTaxPayment,
  EnrichedTransaction,
} from "../types/events";
import { Item } from "../types/item";
import { TransactionRepository } from "../types/repository";

export const inMemoryTransactionRepo = (): TransactionRepository => {
  const transactions: EnrichedTransaction[] = [];

  function addTransaction(transaction: EnrichedTransaction): void {
    transactions.push(transaction);
    transactions.sort((a, b) => a.timestamp - b.timestamp);
  }

  function addItemToTransaction(invoiceId: string, newItem: Item): void {
    const matchingTransaction = transactions.find((transaction) => {
      if (transaction.eventType === "SALES") {
        const saleTransaction = transaction as EnrichedSale;
        if (saleTransaction.invoiceId === invoiceId) {
          return true;
        }
        return false;
      }
    }) as EnrichedSale;
    matchingTransaction.items.push(newItem);
  }

  function updateItem(
    invoiceId: string,
    itemId: string,
    newItemCost: number,
    newItemTaxRate: number,
  ): void {
    const matchingTransaction = transactions.find((transaction) => {
      if (transaction.eventType === "SALES") {
        const saleTransaction = transaction as EnrichedSale;
        if (saleTransaction.invoiceId === invoiceId) {
          return true;
        }
        return false;
      }
    }) as EnrichedSale;
    const matchingItem = (matchingTransaction as EnrichedSale)?.items.find(
      (item) => item.itemId === itemId,
    );
    if (matchingItem) {
      const currentTax = matchingItem.cost * matchingItem.taxRate;
      const newTax = newItemCost * newItemTaxRate;
      matchingItem.cost = newItemCost;
      matchingItem.taxRate = newItemTaxRate;
      matchingTransaction.totalTax += newTax - currentTax;
    }
  }

  function getAllTransactions(): EnrichedTransaction[] {
    return transactions.sort((a, b) => a.timestamp - b.timestamp);
  }

  function getSales(): EnrichedSale[] {
    return transactions.filter(
      (transaction) => transaction.eventType === "SALES",
    ) as EnrichedSale[];
  }

  function getTaxPayments(): EnrichedTaxPayment[] {
    return transactions.filter(
      (transaction) => transaction.eventType === "TAX_PAYMENT",
    ) as EnrichedTaxPayment[];
  }
  return {
    addTransaction,
    addItemToTransaction,
    updateItem,
    getAllTransactions,
    getSales,
    getTaxPayments,
  };
};
