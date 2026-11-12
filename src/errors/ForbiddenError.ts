/**
 * @file ForbiddenError.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

/**
 * Represents an HTTP 403 Forbidden error.
 *
 * Used when a user does not have permission to perform an action.
 */
export class ForbiddenError extends Error {
    statusCode = 403;

    /**
     * Creates a forbidden error.
     *
     * @param message - Optional error message.
     */
    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}
