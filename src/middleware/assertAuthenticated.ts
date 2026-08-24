import { type Request } from "express";
import { type AuthAdmin } from "../types/auth.js";

export function assertAuthenticated(
    req: Request
): asserts req is Request & { auth: AuthAdmin} {
    if (!req.auth) {
        throw new Error("Authentication middle missing")
    }
}