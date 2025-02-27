import { EnrichedTransaction } from "./events";
import { EnrichedAmendSale } from "./item";
import { Response } from "express";

export interface TransactionService {
  addTransaction(transaction: EnrichedTransaction, res: Response): void;
  getAllTransactions(res: Response): void;
  getAllSales(res: Response): void;
  getTaxPayments(res: Response): void;
  getTaxPosition(stringDate: string, timestamp: number, res: Response): void;
  amendSale(sale: EnrichedAmendSale, res: Response): void;
}
