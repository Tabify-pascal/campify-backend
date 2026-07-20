import { prisma } from "../prisma.js";
import { verifyPassword } from "../utils/password.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function login(email: string, password: string){
    const admin = await prisma.adminUser.findUnique({
        where: {email},
    });

    if(!admin){
        throw new ValidationError("Invalid email or password");
    }

    const validPassword = await verifyPassword(
        password,
        admin.passwordHash
    );

    if (!validPassword){
        throw new ValidationError("Invalid email or password");
    }

    return admin;
}

export async function getAuthenticatedUser(userId: string){
    const admin = await prisma.adminUser.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    if (!admin) {
        throw new NotFoundError("Admin user not found");
    }

    return admin;
}