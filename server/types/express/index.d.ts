import "express";

declare global {
    namespace Express {
        interface Request {
            context?: {
                id: string;
                name: string;
                role: string;
            };
        }
    }
}
