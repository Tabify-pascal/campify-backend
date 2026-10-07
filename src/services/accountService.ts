import { prisma } from "../prisma.js";

export async function getAccountReservations(
    email: string
) {
    return prisma.reservation.findMany({
        where: {
            email,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            guests: true,
            arrivalDate: true,
            departureDate: true,
            notes: true,

            status: true,
            paymentStatus: true,

            pricePerNight: true,
            totalPrice: true,

            spot: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            },
        },
        orderBy: {
            arrivalDate: "desc",
        },
    });
}