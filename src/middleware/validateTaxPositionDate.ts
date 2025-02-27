import { Request, Response, NextFunction } from "express";
import { isISODateString } from "../utils/validateDate";
import { logger } from "../utils/logger";
export const validateTaxPositionDate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const date = req.query.date as string;
  if (!date) {
    logger.warn("No date provided for tax position");
    res.status(400).send("Please provide a date");
  } else if (!isISODateString(date)) {
    logger.warn(
      "Wrong date format provided for tax position, needs to be ISO 8601",
    );
    res.status(400).send("Invalid date format, needs to be ISO 8601");
  } else {
    res.locals.timestamp = Date.parse(date);
    next();
  }
};
