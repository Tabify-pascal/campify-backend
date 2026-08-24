import { prisma } from "../prisma.js";

import { hashPassword, verifyPassword } from "../utils/password.js";

import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

import type {
    RegisterAccountBody,
    LoginAccountBody,
} from "../schemas/accountSchema.js";

export async function registerAccount(
    data: RegisterAccountBody
) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingUser) {
        throw new ValidationError(
            "An account with this email address already exists"
        );
    }

    const passwordHash = await hashPassword(
        data.password
    );

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}

export async function loginAccount(
    data: LoginAccountBody
) {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (!user) {
        throw new ValidationError(
            "Invalid email or password"
        );
    }

    const validPassword = await verifyPassword(
        data.password,
        user.passwordHash
    );

    if (!validPassword) {
        throw new ValidationError(
            "Invalid email or password"
        );
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}

export async function getAccountById(
    userId: string
) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    if (!user) {
        throw new NotFoundError("User");
    }

    return user;
}

export async function getAccountReservations(
    email: string
) {
    return prisma.reservation.findMany({
        where: {
            email,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            guests: true,
            arrivalDate: true,
            departureDate: true,
            notes: true,
            status: true,

            spot: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            },
        },
        orderBy: {
            arrivalDate: "desc",
        },
    });
}