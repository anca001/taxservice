import { Request, Response, NextFunction } from "express";
import { AmendSale } from "../types/item";
export const enrichAmend = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const transaction = req.body as AmendSale;
  res.locals.enrichedEvent = {
    ...transaction,
    totalTax: transaction.cost * transaction.taxRate,
    timestamp: Date.parse(transaction.date),
  };
  next();
};
