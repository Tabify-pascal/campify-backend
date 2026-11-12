/**
 * @file assertAuthenticated.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-22
 */

import { type Request } from "express";
import { type AuthUser } from "../types/user.js";

/**
 * Ensures that the request contains authenticated user information.
 *
 * @param req - Express request to check for authentication data.
 * @returns Nothing. Narrows the request type to include an authenticated user.
 * @throws {Error} If authentication middleware has not populated the request.
 */
export function assertAuthenticated(
    req: Request,
): asserts req is Request & { auth: AuthUser } {
    if (!req.auth) {
        throw new Error("Authentication middleware missing");
    }
}
