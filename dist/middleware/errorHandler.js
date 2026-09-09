import {} from "express";
import { ZodError } from "zod";
export function errorHandler(error, _req, res, _next) {
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
//# sourceMappingURL=errorHandler.js.map