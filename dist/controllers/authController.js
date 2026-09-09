import {} from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, registerSchema, } from "../schemas/authSchema.js";
import { createAuthToken } from "../utils/authToken.js";
import { getAuthenticatedUser, login, register, } from "../services/authService.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";
const cookieName = process.env.AUTH_COOKIE_NAME ?? "campify_auth";
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60 * 1000,
};
export const registerUser = asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const user = await register(data);
    const token = await createAuthToken({
        sub: user.id,
        email: user.email,
        role: user.role,
    });
    res.cookie(cookieName, token, cookieOptions);
    res.status(201).json({
        user,
    });
});
export const loginUser = asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await login(data);
    const token = await createAuthToken({
        sub: user.id,
        email: user.email,
        role: user.role,
    });
    res.cookie(cookieName, token, cookieOptions);
    res.json({
        user,
    });
});
export const getCurrentUser = asyncHandler(async (req, res) => {
    assertAuthenticated(req);
    const user = await getAuthenticatedUser(req.auth.userId);
    res.json({
        user,
    });
});
export const logoutUser = asyncHandler(async (_req, res) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.status(204).send();
});
//# sourceMappingURL=authController.js.map