import type { AuthUser } from "./auth.ts";

declare global {
    namespace Express {
        interface Request {
            auth?: AuthUser;
        }
    }
}

export {};