import express, { Request, Response } from "express";
import { transactionSvc } from "../utils/initialiser";
import { validateTransactionAttributes } from "../middleware/validateTransactionAttributes";
import { validateTransactionValues } from "../middleware/validateTransactionValues";
import { enrichEvent } from "../middleware/enrichEvent";
import { EnrichedTransaction } from "../types/events";
import { validateAmendment } from "../middleware/validateAmendment";
import { enrichAmend } from "../middleware/enrichAmend";
import { EnrichedAmendSale } from "../types/item";
import { validateTaxPositionDate } from "../middleware/validateTaxPositionDate";

export const transactionRouter = express.Router();

transactionRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is a Tax Service built with Express!");
});

transactionRouter.get("/transactions", (req: Request, res: Response) => {
  transactionSvc.getAllTransactions(res);
});

transactionRouter.post(
  "/transactions",
  validateTransactionAttributes,
  validateTransactionValues,
  enrichEvent,
  (req: Request, res: Response) => {
    const transaction = res.locals.enrichedEvent as EnrichedTransaction;
    transactionSvc.addTransaction(transaction, res);
  },
);

transactionRouter.get("/sales", (req: Request, res: Response) => {
  transactionSvc.getAllSales(res);
});

transactionRouter.get("/tax-payments", (req: Request, res: Response) => {
  transactionSvc.getTaxPayments(res);
});

transactionRouter.get(
  "/tax-position",
  validateTaxPositionDate,
  (req: Request, res: Response) => {
    transactionSvc.getTaxPosition(
      req.query.date as string,
      res.locals.timestamp,
      res,
    );
  },
);

transactionRouter.patch(
  "/sale",
  validateAmendment,
  enrichAmend,
  (req: Request, res: Response) => {
    transactionSvc.amendSale(
      res.locals.enrichedEvent as EnrichedAmendSale,
      res,
    );
  },
);

transactionRouter.get("/status", (req: Request, res: Response) => {
  const status = { Status: "Running" };
  res.send(status);
});
