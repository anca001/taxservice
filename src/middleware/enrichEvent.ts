import { Request, Response, NextFunction } from "express";
import { TransactionEvent, Sale } from "../types/events";
import { Item } from "../types/item";
export const enrichEvent = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const transaction = req.body as TransactionEvent;
  res.locals.enrichedEvent = {
    ...transaction,
  };
  res.locals.enrichedEvent.timestamp = Date.parse(transaction.date);
  if (transaction.eventType === "SALES") {
    const saleTransaction = transaction as Sale;
    let totalTax: number = 0;
    saleTransaction.items.forEach((item: Item) => {
      const itemTax = item.cost * item.taxRate;
      totalTax += itemTax;
    });
    res.locals.enrichedEvent.totalTax = totalTax;
  }

  next();
};
