import { prisma } from "../prisma.js";
import { type SpotAvailability } from "../types/availability.js";
import { type SpotSearchQuery } from "../schemas/spotSearchSchema.js";

export async function getAllSpots(query?: SpotSearchQuery){
    return prisma.spot.findMany({
        where: {
            ...(query?.guests
                ? {
                    capacity: {
                        gte: query.guests,
                    },
                }
                : {}
            ),

            ...(query?.arrivalDate && query?.departureDate
                ? {
                    reservations: {
                        none: {
                            status: {
                                in: ["PENDING", "CONFIRMED"],
                            },
                            arrivalDate: {
                                lt: query.departureDate,
                            },
                            departureDate: {
                                gt: query.arrivalDate,
                            },
                        },
                    },
                } : {}
            ),
        },
        include: {
            features: true,
        },
    });
}

export async function getSpotById(id: string) {
    return prisma.spot.findUnique({
        where: { id },
        include: {
            features: true,
        },
    });
}

function getDatesBetween(startDate: Date, endDate: Date) {
    const dates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
        dates.push(currentDate.toISOString().slice(0,10));
        currentDate.setDate(currentDate.getDate() +1);
    }

    return dates;
}

export async function getSpotAvailability(id: string, startDate: Date, endDate: Date) : Promise<SpotAvailability | null> {
    const spot = await prisma.spot.findUnique({
        where: { id },
    });

    if (!spot) {
        return null;
    }

    const reservations = await prisma.reservation.findMany({
        where: {
            spotId : id,
            status: {
                in: ["PENDING", "CONFIRMED"],
            },
            arrivalDate: {
                lt: endDate,
            }, 
            departureDate: { 
                gt: startDate,
            },
        },
        select: {
            arrivalDate: true,
            departureDate: true,
        },
        orderBy: {
            arrivalDate: "asc",
        },
    });

    const unavailableDates = reservations.flatMap((reservation) =>
        getDatesBetween(
            reservation.arrivalDate < startDate ? startDate : reservation.arrivalDate,
            reservation.departureDate > endDate ? endDate : reservation.departureDate
        )
    );

    return {
        spotId: id,
        startDate: startDate.toISOString().slice(0,10),
        endDate: endDate.toISOString().slice(0, 10),
        unavailableDates,
    };
}