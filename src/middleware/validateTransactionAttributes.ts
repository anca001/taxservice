import { Request, Response, NextFunction } from "express";
import { TransactionEvent } from "../types/events";
import { isISODateString } from "../utils/validateDate";
import { logger } from "../utils/logger";

export const validateTransactionAttributes = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const transaction = req.body as TransactionEvent;
  if (transaction && transaction.eventType && transaction.date) {
    if (!isISODateString(transaction.date)) {
      logger.warn(
        "Wrong date format provided for tax position, needs to be ISO 8601",
      );
      res.status(400).send("Invalid date format, needs to be ISO 8601");
    } else {
      next();
    }
  } else {
    logger.warn("Missing required transaction field(s)");
    res.status(400).send("Invalid transaction");
  }
};
