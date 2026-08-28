import { type Request } from "express";
import { type AuthUser } from "../types/user.js";

export function assertAuthenticated(
    req: Request
): asserts req is Request & { auth: AuthUser } {
    if (!req.auth) {
        throw new Error("Authentication middleware missing");
    }
}