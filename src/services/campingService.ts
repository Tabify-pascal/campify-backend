/**
 * @file campingService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";

/**
 * Retrieves all campings sorted alphabetically by name.
 *
 * @returns A list of campings.
 */
export async function getCampings() {
    return prisma.camping.findMany({
        orderBy: {
            name: "asc",
        },
    });
}

/**
 * Retrieves a specific camping by its ID.
 *
 * @param campingId - ID of the requested camping.
 * @returns The requested camping.
 */
export async function getCampingById(campingId: string) {
    const camping = await prisma.camping.findUnique({
        where: {
            id: campingId,
        },
    });

    if (!camping) {
        throw new NotFoundError("Camping");
    }

    return camping;
}
