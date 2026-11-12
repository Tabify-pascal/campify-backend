/**
 * @file express.d.ts
 * @author Pascal Thomasse Mol
 * @since 2026-11-12
 */

import type { AuthUser } from "./user.js";

declare global {
    namespace Express {
        interface Request {
            auth?: AuthUser;
        }
    }
}

export {};
