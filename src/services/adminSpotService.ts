import { prisma } from "../prisma.js";
import {
    type CreateAdminSpotBody,
    type UpdateAdminSpotBody,
} from "../schemas/adminSpotSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";

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

export function getAdminSpotById(id: string) {
    return prisma.spot.findUnique({
        where: { id },
        include: spotInclude,
    });
}

export async function createAdminSpot(data: CreateAdminSpotBody) {
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
    data: UpdateAdminSpotBody
) {
    const existingSpot = await prisma.spot.findUnique({
        where: { id },
    });

    if (!existingSpot) {
        throw new NotFoundError("Spot");
    }

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

export async function deleteAdminSpot(id: string) {
    const spot = await prisma.spot.findUnique({
        where: { id },
    });

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    await prisma.spot.delete({
        where: { id },
    });
}