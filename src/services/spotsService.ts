/**
 * @file spotsService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { prisma } from "../prisma.js";
import { type SpotAvailability } from "../types/availability.js";
import { type SpotSearchQuery } from "../schemas/spotSearchSchema.js";

/**
 * Retrieves camping spots with optional search and availability filters.
 *
 * @param query - Optional filters for camping, guests and reservation dates.
 * @returns A list of matching camping spots with features and camping details.
 */
export async function getAllSpots(query?: SpotSearchQuery) {
    return prisma.spot.findMany({
        where: {
            ...(query?.campingId
                ? {
                      campingId: query.campingId,
                  }
                : {}),

            ...(query?.guests
                ? {
                      capacity: {
                          gte: query.guests,
                      },
                  }
                : {}),

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
                  }
                : {}),
        },

        include: {
            features: true,

            camping: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });
}

/**
 * Retrieves a specific camping spot by its ID.
 *
 * @param id - ID of the requested camping spot.
 * @returns The requested camping spot with its features and camping details, or null if not found.
 */
export async function getSpotById(id: string) {
    return prisma.spot.findUnique({
        where: {
            id,
        },
        include: {
            features: true,

            camping: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });
}

/**
 * Generates a list of dates between two dates, excluding the end date.
 *
 * @param startDate - First date of the requested period.
 * @param endDate - End date of the requested period.
 * @returns A list of dates formatted as YYYY-MM-DD.
 */
function getDatesBetween(startDate: Date, endDate: Date) {
    const dates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
        dates.push(currentDate.toISOString().slice(0, 10));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dates;
}

/**
 * Retrieves unavailable dates for a camping spot within a specified period.
 *
 * @param id - ID of the camping spot.
 * @param startDate - Start date of the requested period.
 * @param endDate - End date of the requested period.
 * @returns The availability details, or null if the camping spot does not exist.
 */
export async function getSpotAvailability(
    id: string,
    startDate: Date,
    endDate: Date,
): Promise<SpotAvailability | null> {
    const spot = await prisma.spot.findUnique({
        where: { id },
    });

    if (!spot) {
        return null;
    }

    const reservations = await prisma.reservation.findMany({
        where: {
            spotId: id,
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
            reservation.arrivalDate < startDate
                ? startDate
                : reservation.arrivalDate,
            reservation.departureDate > endDate
                ? endDate
                : reservation.departureDate,
        ),
    );

    return {
        spotId: id,
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        unavailableDates,
    };
}
