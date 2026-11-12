/**
 * @file blookersAuth.ts
 * @author Pascal Thomasse Mol
 * @since 2026-10-05
 */

import { type Request, type Response, type NextFunction } from "express";
import { timingSafeEqual } from "node:crypto";

/**
 * Validates the API key provided by the Blookers integration.
 *
 * @param req - Express request containing the authorization header.
 * @param res - Express response used to return authentication errors.
 * @param next - Express function to continue to the next middleware.
 * @returns Nothing. Continues the request if the API key is valid.
 */
export function requireBlookersAuth(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const apiKey = process.env.BLOOKERS_API_KEY;

    if (!apiKey) {
        console.error("BLOOKERS_API_KEY is not configured");

        res.status(500).json({
            error: "Blookers integration is not configured",
        });
        return;
    }

    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Unauthorized",
        });
        return;
    }

    const providedApiKey = authorization.slice("Bearer ".length);

    const providedKeyBuffer = Buffer.from(providedApiKey);
    const expectedKeyBuffer = Buffer.from(apiKey);

    if (
        providedKeyBuffer.length !== expectedKeyBuffer.length ||
        !timingSafeEqual(providedKeyBuffer, expectedKeyBuffer)
    ) {
        res.status(401).json({
            error: "Unauthorized",
        });
        return;
    }

    next();
}
