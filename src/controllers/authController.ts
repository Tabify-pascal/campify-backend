/**
 * @file authController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-16
 */

import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    loginSchema,
    registerSchema,
    type LoginBody,
    type RegisterBody,
} from "../schemas/authSchema.js";
import { createAuthToken } from "../utils/authToken.js";
import {
    getAuthenticatedUser,
    login,
    register,
} from "../services/authService.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";
import {
    verifyEmailSchema,
    type VerifyEmailBody,
} from "../schemas/verifyEmailSchema.js";
import {
    verifyEmail,
    resendVerificationEmail,
} from "../services/emailVerificationService.js";

import {
    resendVerificationSchema,
    type ResendVerificationBody,
} from "../schemas/resendVerificationSchema.js";


const cookieName = process.env.AUTH_COOKIE_NAME ?? "campify_auth";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 8 * 60 * 60 * 1000,
};


/**
 * Validates the request and registers a new user account.
 *
 * @param req - Request containing the registration details.
 * @param res - Response object.
 * @returns HTTP 201 with the created user and a confirmation message.
 */
export const registerUser = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, RegisterBody>,
        res: Response,
    ) => {
        const data = registerSchema.parse(req.body);

        const user = await register(data);

        res.status(201).json({
            message:
                "Account created. Please verify your email address before logging in.",
            user,
        });
    },
);


/**
 * Authenticates a user and sets an authentication cookie.
 *
 * @param req - Request containing the login credentials.
 * @param res - Response object.
 * @returns JSON containing the authenticated user.
 */
export const loginUser = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, LoginBody>,
        res: Response,
    ) => {
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
    },
);


/**
 * Retrieves the currently authenticated user's account details.
 *
 * @param req - Request containing the authenticated user.
 * @param res - Response object.
 * @returns JSON containing the current user.
 */
export const getCurrentUser = asyncHandler(
    async (req: Request, res: Response) => {
        assertAuthenticated(req);

        const user = await getAuthenticatedUser(req.auth.userId);

        res.json({
            user,
        });
    },
);


/**
 * Logs out the user by clearing the authentication cookie.
 *
 * @param _req - Unused request object.
 * @param res - Response object.
 * @returns HTTP 204 with no content.
 */
export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(204).send();
});


/**
 * Validates a verification token and verifies the user's email address.
 *
 * @param req - Request containing the email verification token.
 * @param res - Response object.
 * @returns JSON containing a verification confirmation message.
 */
export const verifyEmailAddress = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, VerifyEmailBody>,
        res: Response,
    ) => {
        const data = verifyEmailSchema.parse(req.body);

        await verifyEmail(data.token);

        res.json({
            message: "Email address verified successfully",
        });
    },
);


/**
 * Requests a new email verification link for a user.
 *
 * @param req - Request containing the user's email address.
 * @param res - Response object.
 * @returns JSON containing a confirmation message.
 */
export const resendVerification = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, ResendVerificationBody>,
        res: Response,
    ) => {
        const data = resendVerificationSchema.parse(req.body);

        await resendVerificationEmail(data.email);

        res.json({
            message:
                "If this email address requires verification, a new link has been sent.",
        });
    },
);
