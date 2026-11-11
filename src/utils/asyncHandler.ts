/**
 * @file asyncHandler.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { type RequestHandler, type NextFunction, type Request, type Response } from "express";

export function asyncHandler<P = Record<string, string>>(
    handler: (
        req: Request<P>,
        res: Response,
        next: NextFunction
    ) => Promise<void>
): RequestHandler<P> {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    }
}