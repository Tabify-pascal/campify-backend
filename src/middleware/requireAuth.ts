/**
 * @file requireAuth.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-13
 */

import { type Request, type Response, type NextFunction } from "express";

import { verifyAuthToken } from "../utils/authToken.js";

const cookieName = process.env.AUTH_COOKIE_NAME ?? "campify_auth";

/**
 * Authenticates a request using a JWT stored in a cookie.
 *
 * @param req - Express request containing the authentication cookie.
 * @param res - Express response used to return authentication errors.
 * @param next - Express function to continue to the next middleware.
 * @returns A promise that resolves when authentication has been processed.
 */
export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const token = req.cookies?.[cookieName];

    if (!token) {
        res.status(401).json({
            error: "Unauthorized",
        });

        return;
    }

    try {
        const payload = await verifyAuthToken(token);

        req.auth = {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    } catch {
        res.status(401).json({
            error: "Unauthorized",
        });
        return;
    }

    next();
}
