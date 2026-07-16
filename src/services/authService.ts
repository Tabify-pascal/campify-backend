import { prisma } from "../prisma.js";
import { verifyPassword } from "../utils/password.js";
import { ValidationError } from "../errors/ValidationError.js";

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