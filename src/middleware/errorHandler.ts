/**
 * @file errorHandler.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Handles errors and returns an appropriate HTTP error response.
 *
 * @param error - Error containing a message and optional HTTP status code.
 * @param _req - Express request object (unused).
 * @param res - Express response used to return the error.
 * @param _next - Express next function (unused).
 * @returns An HTTP response for validation errors, otherwise nothing.
 */
export function errorHandler(
    error: Error & { statusCode?: number },
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: "Validation failed",
            issues: error.issues,
        });
    }

    console.error(error);

    const statusCode = error.statusCode ?? 500;

    const message =
        statusCode >= 500 && process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message || "Internal server error";

    res.status(statusCode).json({
        error: message,
    });
}
