import type { PrismaClient } from "@prisma/client";

import { hashPassword } from "../../src/utils/password.js";

export async function seedAdmin(prisma: PrismaClient) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminFirstName = process.env.ADMIN_FIRST_NAME;
    const adminLastName = process.env.ADMIN_LAST_NAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
        !adminEmail ||
        !adminFirstName ||
        !adminLastName ||
        !adminPassword
    ) {
        throw new Error(
            "Admin environment variables must be configured"
        );
    }

    const passwordHash = await hashPassword(adminPassword);

    await prisma.user.upsert({
        where: {
            email: adminEmail,
        },
        update: {
            firstName: adminFirstName,
            lastName: adminLastName,
            passwordHash,
            role: "ADMIN",
        },
        create: {
            email: adminEmail,
            firstName: adminFirstName,
            lastName: adminLastName,
            passwordHash,
            role: "ADMIN",
        },
    });
}