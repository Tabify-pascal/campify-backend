/**
 * @file ForbiddenError.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

export class ForbiddenError extends Error {
    statusCode = 403;

    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}