/**
 * @file accountService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-08-24
 */

import { prisma } from "../prisma.js";


/**
 * Retrieves all reservations associated with an email address,
 * ordered by arrival date from newest to oldest.
 *
 * @param email - Email address used to find the reservations.
 * @returns A list of reservations with their details and camping spot information.
 */
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