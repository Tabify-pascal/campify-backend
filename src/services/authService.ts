import { prisma } from "../prisma.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { RegisterBody, LoginBody } from "../schemas/authSchema.js";


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

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
}

export async function register(data: RegisterBody) {
    const email = data.email.toLowerCase();

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

    return prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email,
            passwordHash,
            role: "CUSTOMER",
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
        },
    });
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