import { transactionService } from "../services/transactionService";
import { inMemoryTransactionRepo } from "../repositories/transactionRepository";
import { logger } from "./logger";

export const inMemoryDB = inMemoryTransactionRepo();
export const transactionSvc = transactionService(inMemoryDB, logger);
