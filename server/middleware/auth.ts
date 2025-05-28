import { Request, Response, NextFunction } from "express";

/**
 * Middleware that authenticates the session and populates the request context.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const sessionAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.context !== undefined) {
        req.context = req.session.context;
        return next();
    } else {
        return res.status(403).json({
            login: true,
            error: { message: "Unauthorized access" },
        });
    }
};
