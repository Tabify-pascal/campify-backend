import type { PrismaClient } from "@prisma/client";

import { hashPassword } from "../../src/utils/password.js";
import type { SeedCampings } from "./campings.seed.js";

export async function seedManagers(
    prisma: PrismaClient,
    campings: SeedCampings
) {
    const bosManagerPassword =
        process.env.MANAGER_BOSRAND_PASSWORD;

    const meerManagerPassword =
        process.env.MANAGER_MEER_PASSWORD;

    if (!bosManagerPassword || !meerManagerPassword) {
        throw new Error(
            "Manager environment variables must be configured"
        );
    }

    const bosManagerPasswordHash =
        await hashPassword(bosManagerPassword);

    const meerManagerPasswordHash =
        await hashPassword(meerManagerPassword);

    const bosManager = await prisma.user.upsert({
        where: {
            email: "pascalthomasse@hotmail.com",
        },
        update: {
            firstName: "Manager",
            lastName: "Bosrand",
            passwordHash: bosManagerPasswordHash,
            role: "MANAGER",
        },
        create: {
            firstName: "Manager",
            lastName: "Bosrand",
            email: "pascalthomasse@hotmail.com",
            passwordHash: bosManagerPasswordHash,
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
            passwordHash: meerManagerPasswordHash,
            role: "MANAGER",
        },
        create: {
            firstName: "Manager",
            lastName: "Het Meer",
            email: "pascalthomasse@outlook.com",
            passwordHash: meerManagerPasswordHash,
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