import {} from "express";
import { verifyAuthToken } from "../utils/authToken.js";
const cookieName = process.env.AUTH_COOKIE_NAME ?? "campify_auth";
export async function requireAuth(req, res, next) {
    const token = req.cookies?.[cookieName];
    if (!token) {
        res.status(401).json({
            error: "Unauthorized",
        });
        return;
    }
    try {
        const payload = await verifyAuthToken(token);
        req.auth = {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch {
        res.status(401).json({
            error: "Unauthorized",
        });
    }
}
//# sourceMappingURL=requireAuth.js.map