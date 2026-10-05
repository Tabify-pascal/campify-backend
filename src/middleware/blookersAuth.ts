import {
    type Request,
    type Response,
    type NextFunction,
} from "express";

export function requireBlookersAuth(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const apiKey = process.env.BLOOKERS_API_KEY;

    if (!apiKey) {
        console.error(
            "BLOOKERS_API_KEY is not configured"
        );

        res.status(500).json({
            error: "Blookers integration is not configured",
        });
        return;
    }

    const authorization =
        req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Unauthorized",
        });
        return;
    }

    const providedApiKey =
        authorization.slice("Bearer ".length);

    if (providedApiKey !== apiKey) {
        res.status(401).json({
            error: "Unauthorized",
        });
        return;
    }

    next();
}