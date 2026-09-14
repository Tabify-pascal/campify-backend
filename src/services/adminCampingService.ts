import { prisma } from "../prisma.js";
import type { UserRole } from "../types/user.js";
import type { AdminCampingBody } from "../schemas/adminCampingSchema.js";

import { NotFoundError } from "../errors/NotFoundError.js";
import { assertCanManageCamping } from "../utils/assertCanManageCamping.js";

export async function getAdminCampings(
    userId: string,
    role: UserRole
) {
    return prisma.camping.findMany({
        where:
            role === "ADMIN"
                ? {}
                : {
                    managers: {
                        some: {
                            userId,
                        },
                    },
                },

        orderBy: {
            name: "asc",
        },
    });
}

export async function getAdminCampingById(
    campingId: string,
    userId: string,
    role: UserRole
) {
    const camping = await prisma.camping.findUnique({
        where: {
            id: campingId,
        },
    });

    if (!camping) {
        throw new NotFoundError("Camping");
    }

    await assertCanManageCamping(
        userId,
        role,
        campingId
    );

    return camping;
}

export async function createAdminCamping(
    data: AdminCampingBody
) {
    return prisma.camping.create({
        data: {
            name: data.name,
            slug: data.slug,
                ...(data.logoUrl !== undefined
                ? { logoUrl: data.logoUrl }
                : {}),
            ...(data.description !== undefined
                ? { description: data.description }
                : {}),
        },
    });
}

export async function updateAdminCamping(
    campingId: string,
    data: AdminCampingBody,
    userId: string,
    role: UserRole
) {
    await assertCanManageCamping(
        userId,
        role,
        campingId
    );

    return prisma.camping.update({
        where: {
            id: campingId,
        },
        data: {
            name: data.name,
            slug: data.slug,
            ...(data.description !== undefined
                ? { description: data.description }
                : {}),
            ...(data.logoUrl !== undefined
                ? { logoUrl: data.logoUrl }
                : {}),
        },
    });
}

export async function deleteAdminCamping(campingId: string) {
    const camping = await prisma.camping.findUnique({
        where: {
            id: campingId,
        },
        include: {
            spots: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!camping) {
        throw new NotFoundError("Camping");
    }

    if (camping.spots.length > 0) {
        throw new Error(
            "Camping cannot be deleted while it still has spots"
        );
    }

    await prisma.camping.delete({
        where: {
            id: campingId,
        },
    });
}