import express from "express";
import cors from "cors";
import { logger } from "./utils/logger";
import { transactionRouter } from "./routes/transactions";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/", transactionRouter);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
