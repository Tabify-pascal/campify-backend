import { type Request, type Response, type NextFunction } from "express";
import { verifyAuthToken } from "../utils/authToken.js";

const cookieName = process.env.AUTH_COOKIE_NAME ?? "campify_admin";

export async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void>{
    const token = req.cookies?.[cookieName];

    if(!token){
        res.status(401).json({
            error: "Unauthorized",
        });

        return;
    }

    try {
        const payload = await verifyAuthToken(token);

        if (payload.role !== "admin"){
            res.status(403).json({
                error: "Forbidden",
            });

            return;
        }

        req.auth = {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };

        next();
    } catch {
        res.status(401).json({
            error: "Unauthorized",
        });
    }
    
}