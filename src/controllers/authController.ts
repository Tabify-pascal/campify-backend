import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, type LoginBody } from "../schemas/loginSchema.js";
import { createAuthToken } from "../utils/authToken.js";
import {
    getAuthenticatedUser, login,
} from "../services/authService.js"
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";

const cookieName = process.env.AUTH_COOKIE_NAME ?? "campify_admin";

export const loginUser = asyncHandler(async (
    req: Request<Record<string, never>, unknown, LoginBody>,
    res: Response
) => {
    const data = loginSchema.parse(req.body);

    const admin = await login(
        data.email,
        data.password
    );

    const token = await createAuthToken({
        sub: admin.id,
        email: admin.email,
        role: "admin",
    });

    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
        user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: "admin"
        },
    });
});

export const getCurrentUser = asyncHandler(async (
    req: Request,
    res: Response
) => {
    assertAuthenticated(req);

    const admin = await getAuthenticatedUser(
        req.auth.userId
    );

    res.json({
        user: {
            ...admin,
            role: "admin",
        },
    });
});

export const logoutUser = asyncHandler(async(
    req: Request,
    res: Response
) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(204).send();
});