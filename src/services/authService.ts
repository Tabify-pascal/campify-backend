/**
 * @file authService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-16
 */

import { prisma } from "../prisma.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { RegisterBody, LoginBody } from "../schemas/authSchema.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { sendMail } from "./mailService.js";
import { createEmailVerificationToken } from "./emailVerificationService.js";

const emailVerificationEnabled =
    process.env.EMAIL_VERIFICATION_ENABLED !== "false";

export async function login(
    data: LoginBody
) {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email.toLowerCase(),
        },
    });


    if (!user) {
        throw new ValidationError(
            "Invalid email or password"
        );
    }

    const passwordValid = await verifyPassword(
        data.password,
        user.passwordHash
    );

    if (!passwordValid) {
        throw new ValidationError(
            "Invalid email or password"
        );
    }

    if (emailVerificationEnabled && !user.emailVerifiedAt) {
        throw new ForbiddenError(
            "Please verify your email address before logging in."
        );
    }

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
}

export async function register(data: RegisterBody) {
    const email = data.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ValidationError(
            "An account with this email address already exists"
        );
    }

    const passwordHash = await hashPassword(
        data.password
    );

    const user = await prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email,
            passwordHash,
            role: "CUSTOMER",

            emailVerifiedAt: emailVerificationEnabled
                ? null
                : new Date(),
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
        },
    });

    if (emailVerificationEnabled) {
        const token = await createEmailVerificationToken(
            user.id
        );

        const frontendUrl = process.env.FRONTEND_URL;

        if (!frontendUrl) {
            throw new Error("FRONTEND_URL is not configured");
        }

        const verificationUrl = new URL(
            "/verify-email",
            frontendUrl
        );

        verificationUrl.searchParams.set("token", token);

        await sendMail({
            to: user.email,
            subject: "Verify your Campify account",
            text: [
                `Hello ${user.firstName},`,
                "",
                "Thank you for registering with Campify.",
                "Please verify your email address:",
                "",
                verificationUrl.toString(),
                "",
                "This link is valid for 24 hours.",
                "",
                "Kind regards,",
                "Campify",
            ].join("\n"),
        });
    }

    return user;
}

export async function getAuthenticatedUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
        },
    });

    if (!user) {
        throw new NotFoundError("User");
    }

    return user;
}