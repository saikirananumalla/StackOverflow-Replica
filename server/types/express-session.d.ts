// types/express-session.d.ts
import "express-session";

declare module "express-session" {
    interface SessionData {
        context?: {
            id: string;
            name: string;
            role: string;
        };
        csrfToken?: string;
    }
}
