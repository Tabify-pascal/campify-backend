import type { AuthUser } from "./user.js";

declare global {
    namespace Express {
        interface Request {
            auth?: AuthUser;
        }
    }
}

export {};