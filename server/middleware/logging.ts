import { Request, Response, NextFunction } from "express";
import { getLogger } from "log4js";

const logger = getLogger("middleware/inputLogging");

/**
 * Logs incoming requests along with body and user (if available).
 */
export const inputLogging = (req: Request, res: Response, next: NextFunction): void => {
    const userName = req.context?.name ?? "Anonymous";

    const logBody = Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : "No Body";

    logger.info(`→ ${req.method} ${req.originalUrl} | Body: ${logBody} | Requested by: ${userName}`);

    next();
};
