import { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
    error: Error & { statusCode?: number},
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: "Validation failed",
            issues: error.issues,
        });
    }

    console.error(error);

    res.status(error.statusCode ?? 500).json({
        error: error.message || "Internal server error",
    });
}