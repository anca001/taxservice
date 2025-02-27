import { Request, Response, NextFunction } from "express";
import { isISODateString } from "../utils/validateDate";
import { logger } from "../utils/logger";
export const validateAmendment = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const date = req.body.date as string;
  const itemId = req.body.itemId as string;
  if (!itemId) {
    logger.warn("No itemId was provided in Amendment");
    res.status(400).send("Please provide an itemId");
  } else if (!date) {
    logger.warn("No date was provided in Amendment");
    res.status(400).send("Please provide a date");
  } else if (!isISODateString(date)) {
    logger.warn("Date provided in Amendment is not in ISO format");
    res.status(400).send("Invalid date format, needs to be ISO 8601");
  } else {
    res.locals.timestamp = Date.parse(date);
    next();
  }
};
