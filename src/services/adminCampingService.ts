import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { AdminCampingBody } from "../schemas/adminCampingSchema.js";

export async function getAdminCampings() {
    return prisma.camping.findMany({
        orderBy: {
            name: "asc",
        },
    });
}

export async function getAdminCampingById(campingId: string) {
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
    data: AdminCampingBody
) {
    const existingCamping = await prisma.camping.findUnique({
        where: {
            id: campingId,
        },
        select: {
            id: true,
        },
    });

    if (!existingCamping) {
        throw new NotFoundError("Camping");
    }

    return prisma.camping.update({
        where: {
            id: campingId,
        },
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