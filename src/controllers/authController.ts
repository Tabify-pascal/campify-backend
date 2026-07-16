import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, type LoginBody } from "../schemas/loginSchema.js";
import { login } from "../services/authService.js";

export const loginUser = asyncHandler(async (
    req: Request<Record<string, never>, unknown, LoginBody>,
    res: Response
) => {
    const data = loginSchema.parse(req.body);

    const admin = await login(
        data.email,
        data.password
    );

    res.json({
        user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
        },
    });
});