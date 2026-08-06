import { prisma } from "../prisma.js";

export async function getAdminDashboardSummary() {
    const [
        newReservations,
        newMessages,
        totalNewsItems,
        totalSpots,
    ] = await Promise.all([
        prisma.reservation.count({
            where: { 
                status: "PENDING",
            },
        }),

        prisma.contactMessage.count({
            where: {
                status: "NEW",
            },
        }),

        prisma.newsItem.count(),

        prisma.spot.count(),
    ]);

    return {
        newReservations,
        newMessages,
        totalNewsItems,
        totalSpots
    };
}