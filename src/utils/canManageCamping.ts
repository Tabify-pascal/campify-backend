/**
 * @file canManageCamping.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

import { prisma } from "../prisma.js";
import type { UserRole } from "../types/user.js";

/**
 * Checks whether a user has permission to manage a specific camping.
 *
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @param campingId - ID of the camping to check.
 * @returns True if the user has permission, otherwise false.
 */
export async function canManageCamping(
    userId: string,
    role: UserRole,
    campingId: string
): Promise<boolean> {
    if (role === "ADMIN") {
        return true;
    }

    if (role !== "MANAGER") {
        return false;
    }

    const relation = await prisma.campingManager.findUnique({
        where: {
            userId_campingId: {
                userId,
                campingId,
            },
        },
        select: {
            userId: true,
        },
    });

    return relation !== null;
}