/**
 * @file assertCanManageCamping.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

import { ForbiddenError } from "../errors/ForbiddenError.js";
import { canManageCamping } from "./canManageCamping.js";
import type { UserRole } from "../types/user.js";

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