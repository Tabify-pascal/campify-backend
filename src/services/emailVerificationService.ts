/**
 * @file emailVerificationService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-11-09
 */

import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../prisma.js";
import { ValidationError } from "../errors/ValidationError.js";
import { sendMail } from "./mailService.js";

const VERIFICATION_TOKEN_HOURS = 24;

/**
 * Generates and stores a secure email verification token.
 *
 * @param userId - ID of the user requesting email verification.
 * @returns The generated verification token.
 */
export async function createEmailVerificationToken(
    userId: string,
): Promise<string> {
    const token = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date(
        Date.now() + VERIFICATION_TOKEN_HOURS * 60 * 60 * 1000,
    );

    await prisma.emailVerificationToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        },
    });

    return token;
}

/**
 * Verifies a user's email address using a valid verification token.
 *
 * @param token - Email verification token received from the verification link.
 * @returns A promise that resolves when the email address is verified.
 */
export async function verifyEmail(token: string): Promise<void> {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const verification = await prisma.emailVerificationToken.findUnique({
        where: {
            tokenHash,
        },
    });

    if (!verification) {
        throw new ValidationError("Invalid or expired verification link");
    }

    if (verification.expiresAt <= new Date()) {
        throw new ValidationError("Invalid or expired verification link");
    }

    await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: {
                id: verification.userId,
            },
            data: {
                emailVerifiedAt: new Date(),
            },
        });

        await tx.emailVerificationToken.deleteMany({
            where: {
                userId: verification.userId,
            },
        });
    });
}

/**
 * Generates a new verification token and resends the verification email.
 *
 * @param email - Email address of the user requesting a new verification link.
 * @returns A promise that resolves when the request has been processed.
 */
export async function resendVerificationEmail(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
        where: {
            email: email.trim().toLowerCase(),
        },
    });

    // Prevent revealing whether an account exists.
    if (!user || user.emailVerifiedAt) {
        return;
    }

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
        throw new Error("FRONTEND_URL is not configured");
    }

    const token = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date(
        Date.now() + VERIFICATION_TOKEN_HOURS * 60 * 60 * 1000,
    );

    // Invalidate previous verification links.
    await prisma.$transaction(async (tx) => {
        await tx.emailVerificationToken.deleteMany({
            where: {
                userId: user.id,
            },
        });

        await tx.emailVerificationToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt,
            },
        });
    });

    const verificationUrl = new URL("/verify-email", frontendUrl);

    verificationUrl.searchParams.set("token", token);

    await sendMail({
        to: user.email,
        subject: "Verify your Campify account",
        text: [
            `Hello ${user.firstName},`,
            "",
            "You requested a new email verification link.",
            "",
            "Verify your email address:",
            verificationUrl.toString(),
            "",
            "This link is valid for 24 hours.",
            "",
            "Kind regards,",
            "Campify",
        ].join("\n"),
    });
}
