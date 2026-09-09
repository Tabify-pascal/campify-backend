import type { PrismaClient } from "@prisma/client";

import { hashPassword } from "../../src/utils/password.js";
import type { SeedCampings } from "./campings.seed.js";

export async function seedManagers(
    prisma: PrismaClient,
    campings: SeedCampings
) {
    const passwordHash = await hashPassword(
        "dummy-manager-password"
    );

    const bosManager = await prisma.user.upsert({
        where: {
            email: "pascalthomasse@hotmail.com",
        },
        update: {
            firstName: "Manager",
            lastName: "Bosrand",
            passwordHash,
            role: "MANAGER",
        },
        create: {
            firstName: "Manager",
            lastName: "Bosrand",
            email: "pascalthomasse@hotmail.com",
            passwordHash,
            role: "MANAGER",
        },
    });

    const meerManager = await prisma.user.upsert({
        where: {
            email: "pascalthomasse@outlook.com",
        },
        update: {
            firstName: "Manager",
            lastName: "Het Meer",
            passwordHash,
            role: "MANAGER",
        },
        create: {
            firstName: "Manager",
            lastName: "Het Meer",
            email: "pascalthomasse@outlook.com",
            passwordHash,
            role: "MANAGER",
        },
    });

    await prisma.campingManager.createMany({
        data: [
            {
                userId: bosManager.id,
                campingId: campings.bosCamping.id,
            },
            {
                userId: meerManager.id,
                campingId: campings.meerCamping.id,
            },
        ],
    });
}