/**
 * @file NotFoundError.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

/**
 * Represents an HTTP 404 Not Found error.
 *
 * Used when a requested resource cannot be found.
 */
export class NotFoundError extends Error {
    statusCode = 404;

    /**
     * Creates a not found error for a specific resource.
     *
     * @param resource - Name of the resource that could not be found.
     */
    constructor(resource: string) {
        super(`${resource} not found`);
        this.name = "NotFoundError";
    }
}
