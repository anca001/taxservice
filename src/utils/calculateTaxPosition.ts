import {
  EnrichedSale,
  EnrichedTaxPayment,
  EnrichedTransaction,
} from "../types/events";

export function calculateTaxPosition(
  transactionsUpTo: EnrichedTransaction[],
): number {
  let taxPosition = 0;
  transactionsUpTo.forEach((transaction) => {
    if (transaction.eventType === "SALES") {
      taxPosition += (transaction as EnrichedSale).totalTax;
    } else if (transaction.eventType === "TAX_PAYMENT") {
      taxPosition -= (transaction as EnrichedTaxPayment).amount;
    }
  });
  return taxPosition;
}
