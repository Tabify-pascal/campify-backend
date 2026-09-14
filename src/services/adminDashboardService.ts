import { prisma } from "../prisma.js";
import type { UserRole } from "../types/user.js";

export async function getAdminDashboardSummary(
    userId: string,
    role: UserRole
) {
    const reservationWhere =
        role === "ADMIN"
            ? {
                status: "PENDING" as const,
            }
            : {
                status: "PENDING" as const,
                spot: {
                    camping: {
                        managers: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
            };

    const messageWhere =
        role === "ADMIN"
            ? {
                status: "NEW" as const,
            }
            : {
                status: "NEW" as const,
                camping: {
                    managers: {
                        some: {
                            userId,
                        },
                    },
                },
            };

    const spotWhere =
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
            };

    const [
        newReservations,
        newMessages,
        totalNewsItems,
        totalSpots,
    ] = await Promise.all([
        prisma.reservation.count({
            where: reservationWhere,
        }),

        prisma.contactMessage.count({
            where: messageWhere,
        }),

        prisma.newsItem.count(),

        prisma.spot.count({
            where: spotWhere,
        }),
    ]);

    return {
        newReservations,
        newMessages,
        totalNewsItems,
        totalSpots,
    };
}