/**
 * @file requireRole.ts
 * @author Pascal Thomasse Mol
 * @since 2026-08-28
 */

import { type Request, type Response, type NextFunction } from "express";

import type { UserRole } from "../types/user.js";

/**
 * Creates middleware that restricts access to users with specific roles.
 *
 * @param roles - User roles that are allowed to access the route.
 * @returns An Express middleware function that checks the user's role.
 */
export function requireRole(...roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.auth) {
            res.status(401).json({
                error: "Unauthorized",
            });

            return;
        }

        if (!roles.includes(req.auth.role)) {
            res.status(403).json({
                error: "Forbidden",
            });

            return;
        }

        next();
    };
}
