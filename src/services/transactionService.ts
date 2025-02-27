import { Response } from "express";
import {
  EnrichedSale,
  EnrichedTaxPayment,
  EnrichedTransaction,
  Sale,
} from "../types/events";
import { TransactionRepository } from "../types/repository";
import { calculateTaxPosition } from "../utils/calculateTaxPosition";
import { EnrichedAmendSale } from "../types/item";
import { TransactionService } from "../types/transactionService";
import winston from "winston";

export const transactionService = (
  inMemoryDB: TransactionRepository,
  logger: winston.Logger,
): TransactionService => {
  logger.info("Creating new service..");
  function addTransaction(
    transaction: EnrichedTransaction,
    res: Response,
  ): void {
    const transactions = inMemoryDB.getAllTransactions();
    try {
      if (transaction.eventType === "SALES") {
        const saleTransaction = transaction as Sale;
        const invoiceExists = transactions.some(
          (transaction) =>
            (transaction as EnrichedSale).invoiceId ===
            saleTransaction.invoiceId,
        );
        if (!invoiceExists) {
          logger.info(
            `Sale with ID=${saleTransaction.invoiceId} has been successfully added`,
          );
          inMemoryDB.addTransaction(transaction as EnrichedSale);
          res.status(202).send(transaction);
        } else {
          logger.warn(
            `Sale with ID=${saleTransaction.invoiceId} already exists`,
          );
          res.status(400).send({ error: "Invoice already exists" });
        }
      } else if (transaction.eventType === "TAX_PAYMENT") {
        const tax = transaction as EnrichedTaxPayment;
        inMemoryDB.addTransaction(tax);
        logger.info(`New tax payment of ${tax.amount} received`);
        res.status(202).send(transaction);
      } else {
        logger.warn("Invalid event type provided");
        res.status(400).send({ error: "Invalid event type" });
      }
    } catch {
      logger.error("Unable to create transaction");
      res.status(500).send({ error: "Unable to create transaction" });
    }
  }
  function getAllTransactions(res: Response): void {
    res.send(inMemoryDB.getAllTransactions());
  }
  function getAllSales(res: Response): void {
    res.send(inMemoryDB.getSales());
  }
  function getTaxPayments(res: Response): void {
    const transactions = inMemoryDB.getAllTransactions();
    logger.info("Getting tax payments..");
    res.send(
      transactions.filter(
        (transaction) => transaction.eventType === "TAX_PAYMENT",
      ),
    );
  }
  function getTaxPosition(
    stringDate: string,
    timestamp: number,
    res: Response,
  ): void {
    const date = timestamp;
    const transactions = inMemoryDB.getAllTransactions();
    const transactionsUpTo = (
      transactions: EnrichedTransaction[],
      date: number,
    ): EnrichedTransaction[] => {
      return transactions.filter(
        (transaction) => transaction.timestamp <= date,
      );
    };
    if (transactions.length === 0) {
      logger.warn("No transactions have been registered yet");
      res.status(400).send({ error: "No transactions available" });
    } else {
      logger.info("Calculating tax position...");
      const taxPosition = calculateTaxPosition(
        transactionsUpTo(transactions, date),
      );
      logger.info("Returning tax position...");
      res.send({ date: stringDate, taxPosition: taxPosition });
    }
  }
  function amendSale(sale: EnrichedAmendSale, res: Response): void {
    const transactions = inMemoryDB.getAllTransactions();
    const invoiceExists = transactions.some((transaction) => {
      if (transaction.eventType === "SALES") {
        return (transaction as EnrichedSale).invoiceId === sale.invoiceId;
      }
      return false;
    });
    if (invoiceExists) {
      logger.info(`Ammending existing sale: ${sale.invoiceId}`);
      transactions.forEach((transaction) => {
        if (transaction.eventType === "SALES") {
          const saleTransaction = transaction as EnrichedSale;
          if (saleTransaction.invoiceId === sale.invoiceId) {
            const itemExists = saleTransaction.items.some(
              (item) => item.itemId === sale.itemId,
            );
            logger.info("Sale exists, processing items..");
            if (itemExists) {
              inMemoryDB.updateItem(
                sale.invoiceId,
                sale.itemId,
                sale.cost,
                sale.taxRate,
              );
              res.send(202);
              logger.info("Item updated");
            } else {
              const newTax = sale.cost * sale.taxRate;
              saleTransaction.totalTax += newTax;
              inMemoryDB.addItemToTransaction(sale.invoiceId, {
                itemId: sale.itemId,
                cost: sale.cost,
                taxRate: sale.taxRate,
              });
              res.send(202);
              logger.info("Item added to existing Sale");
            }
          }
        }
      });
    } else {
      logger.info(
        `Sale does not already exist. Creating new sale ${sale.invoiceId}`,
      );
      const saleTransaction: EnrichedSale = {
        eventType: "SALES",
        date: sale.date,
        invoiceId: sale.invoiceId,
        items: [
          {
            itemId: sale.itemId,
            cost: sale.cost,
            taxRate: sale.taxRate,
          },
        ],
        timestamp: sale.timestamp,
        totalTax: sale.totalTax,
      };
      inMemoryDB.addTransaction(saleTransaction);
      res.send(202);
      logger.info("Sale successfully added");
    }
  }

  return {
    addTransaction,
    getAllTransactions,
    getAllSales,
    getTaxPayments,
    getTaxPosition,
    amendSale,
  };
};
