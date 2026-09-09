import { prisma } from "../prisma.js";
import {
    type CreateAdminSpotBody,
    type UpdateAdminSpotBody,
} from "../schemas/adminSpotSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { UserRole } from "../types/user.js";
import { assertCanManageCamping } from "../utils/assertCanManageCamping.js";

const spotInclude = {
    features: true,
    camping: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
};

export async function getAdminSpots(
    userId: string,
    role: UserRole
) {
    return prisma.spot.findMany({
        where:
            role === "ADMIN"
                ? {}
                : {
                    camping: {
                        managers: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
        include: spotInclude,
        orderBy: {
            name: "asc",
        },
    });
}

export async function getAdminSpotById(
    id: string,
    userId: string,
    role: UserRole
) {
    const spot = await prisma.spot.findUnique({
        where: { id },
        include: spotInclude,
    });

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    await assertCanManageCamping(
        userId,
        role,
        spot.campingId
    );

    return spot;
}

export async function createAdminSpot(
    data: CreateAdminSpotBody,
    userId: string,
    role: UserRole
) {
    await assertCanManageCamping(
        userId,
        role,
        data.campingId
    );

    return prisma.spot.create({
        data: {
            campingId: data.campingId,
            name: data.name,
            description: data.description,
            capacity: data.capacity,
            pricePerNight: data.pricePerNight,
            imageUrl: data.imageUrl,
            size: data.size,
            electricity: data.electricity,
            waterConnection: data.waterConnection,

            features: {
                create: data.features.map((feature) => ({
                    name: feature,
                })),
            },
        },
        include: spotInclude,
    });
}

export async function updateAdminSpot(
    id: string,
    data: UpdateAdminSpotBody,
    userId: string,
    role: UserRole
) {
    const existingSpot = await prisma.spot.findUnique({
        where: { id },
    });

    if (!existingSpot) {
        throw new NotFoundError("Spot");
    }

    await assertCanManageCamping(
        userId,
        role,
        existingSpot.campingId
    );

    await assertCanManageCamping(
        userId,
        role,
        data.campingId
    );

    return prisma.$transaction(async (tx) => {
        await tx.spotFeature.deleteMany({
            where: {
                spotId: id,
            },
        });

        return tx.spot.update({
            where: { id },
            data: {
                campingId: data.campingId,
                name: data.name,
                description: data.description,
                capacity: data.capacity,
                pricePerNight: data.pricePerNight,
                imageUrl:
                    data.imageUrl ?? existingSpot.imageUrl,
                size: data.size,
                electricity: data.electricity,
                waterConnection: data.waterConnection,

                features: {
                    create: data.features.map((feature) => ({
                        name: feature,
                    })),
                },
            },
            include: spotInclude,
        });
    });
}

export async function deleteAdminSpot(
    id: string,
    userId: string,
    role: UserRole
) {
    const spot = await prisma.spot.findUnique({
        where: { id },
    });

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    await assertCanManageCamping(
        userId,
        role,
        spot.campingId
    );

    await prisma.spot.delete({
        where: { id },
    });
}