import type { AuthAdmin } from "./auth.ts";

declare global {
    namespace Express {
        interface Request {
            auth?: AuthAdmin;
        }
    }
}

export {};