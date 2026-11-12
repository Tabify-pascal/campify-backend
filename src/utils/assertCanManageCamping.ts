/**
 * @file assertCanManageCamping.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

import { ForbiddenError } from "../errors/ForbiddenError.js";
import { canManageCamping } from "./canManageCamping.js";
import type { UserRole } from "../types/user.js";

/**
 * Checks whether a user has permission to manage a specific camping.
 *
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @param campingId - ID of the camping to check.
 * @returns A promise that resolves if the user has permission.
 * @throws {ForbiddenError} If the user does not have permission.
 */
export async function assertCanManageCamping(
    userId: string,
    role: UserRole,
    campingId: string
): Promise<void> {
    const allowed = await canManageCamping(
        userId,
        role,
        campingId
    );

    if (!allowed) {
        throw new ForbiddenError();
    }
}