/**
 * @file NotFoundError.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

export class NotFoundError extends Error {
    statusCode = 404;

    constructor(resource: string){
        super(`${resource} not found`);
        this.name = "NotFoundError";
    }
}