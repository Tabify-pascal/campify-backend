import {
    type Request,
    type Response,
    type NextFunction,
} from "express";

import type { UserRole } from "../types/user.js";

export function requireRole(...roles: UserRole[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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