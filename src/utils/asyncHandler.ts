/**
 * @file asyncHandler.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import {
    type RequestHandler,
    type NextFunction,
    type Request,
    type Response,
} from "express";

/**
 * Wraps an asynchronous Express request handler to forward errors.
 *
 * @template P - Type of the request route parameters.
 * @param handler - Asynchronous request handler to wrap.
 * @returns An Express request handler that forwards rejected promises to the error handler.
 */
export function asyncHandler<P = Record<string, string>>(
    handler: (
        req: Request<P>,
        res: Response,
        next: NextFunction,
    ) => Promise<void>,
): RequestHandler<P> {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    };
}
