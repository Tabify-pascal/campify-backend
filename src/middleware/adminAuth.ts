import { type Request, type Response, type NextFunction } from "express";

export function adminAuth(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if ( authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    next();
}