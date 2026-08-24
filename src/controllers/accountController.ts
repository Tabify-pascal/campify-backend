import {
    type Request,
    type Response,
} from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { createAuthToken } from "../utils/authToken.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";

import {
    registerAccountSchema,
    loginAccountSchema,
    type RegisterAccountBody,
    type LoginAccountBody,
} from "../schemas/accountSchema.js";

import {
    registerAccount,
    loginAccount,
    getAccountById,
    getAccountReservations,
} from "../services/accountService.js";

const cookieName =
    process.env.ACCOUNT_AUTH_COOKIE_NAME ??
    "campify_customer";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 8 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (
    req: Request<
        Record<string, never>,
        unknown,
        RegisterAccountBody
    >,
    res: Response
) => {
    const data = registerAccountSchema.parse(
        req.body
    );

    const user = await registerAccount(data);

    const token = await createAuthToken({
        sub: user.id,
        email: user.email,
        role: "customer",
    });

    res.cookie(
        cookieName,
        token,
        cookieOptions
    );

    res.status(201).json({
        user: {
            ...user,
            role: "customer",
        },
    });
});

export const login = asyncHandler(async (
    req: Request<
        Record<string, never>,
        unknown,
        LoginAccountBody
    >,
    res: Response
) => {
    const data = loginAccountSchema.parse(
        req.body
    );

    const user = await loginAccount(data);

    const token = await createAuthToken({
        sub: user.id,
        email: user.email,
        role: "customer",
    });

    res.cookie(
        cookieName,
        token,
        cookieOptions
    );

    res.json({
        user: {
            ...user,
            role: "customer",
        },
    });
});

export const logout = asyncHandler(async (
    _req: Request,
    res: Response
) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(204).send();
});

export const me = asyncHandler(async (
    req: Request,
    res: Response
) => {
    assertAuthenticated(req);

    const user = await getAccountById(
        req.auth.userId
    );

    res.json({
        user: {
            ...user,
            role: "customer",
        },
    });
});

export const getMyReservations =
    asyncHandler(async (
        req: Request,
        res: Response
    ) => {
        assertAuthenticated(req);

        const reservations =
            await getAccountReservations(
                req.auth.email
            );

        res.json(reservations);
    });