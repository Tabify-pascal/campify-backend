/**
 * @file ValidationError.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

/**
 * Represents an HTTP 400 Bad Request error.
 *
 * Used when submitted data does not meet validation requirements.
 */
export class ValidationError extends Error {
    statusCode = 400;

    /**
     * Creates a validation error.
     *
     * @param message - Description of the validation failure.
     */
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}
