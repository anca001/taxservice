import { Request, Response, NextFunction } from "express";
import { TaxPayment, TransactionEvent } from "../types/events";
import { logger } from "../utils/logger";
export const validateTransactionValues = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const transaction = req.body as TransactionEvent;
  if (
    transaction.eventType === "SALES" ||
    transaction.eventType === "TAX_PAYMENT"
  ) {
    if (transaction.eventType === "TAX_PAYMENT") {
      const amount = (transaction as TaxPayment).amount;
      if (amount <= 0) {
        logger.warn(
          `Amount provided for tax payment was negative. Received ${amount}.`,
        );
        res.status(400).send(`Amount cannot be negative: received ${amount}.`);
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    logger.warn(
      `Invalid transaction type, should be SALES or TAX_PAYMENT, type provided was ${transaction.eventType}`,
    );
    res
      .status(400)
      .send(
        `Invalid transaction type, should be SALES or TAX_PAYMENT, type provided was ${transaction.eventType}`,
      );
  }
};
