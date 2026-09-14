import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { assertCanManageCamping } from "../utils/assertCanManageCamping.js";

import type { ReservationStatus } from "@prisma/client";
import type { UserRole } from "../types/user.js";

const reservationInclude = {
    spot: {
        select: {
            id: true,
            name: true,
            campingId: true,
            camping: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    },
};

export async function getAdminReservations(
    userId: string,
    role: UserRole
) {
    return prisma.reservation.findMany({
        where:
            role === "ADMIN"
                ? {}
                : {
                    spot: {
                        camping: {
                            managers: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    },
                },

        include: reservationInclude,

        orderBy: [
            { status: "asc" },
            { arrivalDate: "asc" },
        ],
    });
}

export async function getAdminReservationById(
    id: string,
    userId: string,
    role: UserRole
) {
    const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: reservationInclude,
    });

    if (!reservation) {
        throw new NotFoundError("Reservation");
    }

    await assertCanManageCamping(
        userId,
        role,
        reservation.spot.campingId
    );

    return reservation;
}

export async function deleteAdminReservation(
    id: string,
    userId: string,
    role: UserRole
) {
    const reservation = await prisma.reservation.findUnique({
        where: { id },
        select: {
            id: true,
            spot: {
                select: {
                    campingId: true,
                },
            },
        },
    });

    if (!reservation) {
        throw new NotFoundError("Reservation");
    }

    await assertCanManageCamping(
        userId,
        role,
        reservation.spot.campingId
    );

    await prisma.reservation.delete({
        where: { id },
    });
}

export async function updateAdminReservationStatus(
    id: string,
    status: ReservationStatus,
    userId: string,
    role: UserRole
) {
    const existingReservation =
        await prisma.reservation.findUnique({
            where: { id },
            select: {
                id: true,
                spot: {
                    select: {
                        campingId: true,
                    },
                },
            },
        });

    if (!existingReservation) {
        throw new NotFoundError("Reservation");
    }

    await assertCanManageCamping(
        userId,
        role,
        existingReservation.spot.campingId
    );

    return prisma.reservation.update({
        where: { id },
        data: {
            status,
        },
        include: reservationInclude,
    });
}