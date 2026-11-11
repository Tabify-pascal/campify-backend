/**
 * @file ValidationError.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

export class ValidationError extends Error {
    statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}