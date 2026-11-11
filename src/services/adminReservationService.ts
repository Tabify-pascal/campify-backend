/**
 * @file adminReservationService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-14
 */

import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { assertCanManageCamping } from "../utils/assertCanManageCamping.js";
import { sendReservationStatusNotification } from "./reservationNotificationService.js";
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

/**
 * Retrieves all reservations accessible to an admin or manager.
 *
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @returns A list of reservations with camping details, sorted by status and arrival date.
 */
export async function getAdminReservations(userId: string, role: UserRole) {
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

        orderBy: [{ status: "asc" }, { arrivalDate: "asc" }],
    });
}

/**
 * Retrieves a reservation by its ID after checking user permissions.
 *
 * @param id - ID of the requested reservation.
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @returns The requested reservation with camping details.
 */
export async function getAdminReservationById(
    id: string,
    userId: string,
    role: UserRole,
) {
    const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: reservationInclude,
    });

    if (!reservation) {
        throw new NotFoundError("Reservation");
    }

    await assertCanManageCamping(userId, role, reservation.spot.campingId);

    return reservation;
}

/**
 * Deletes a reservation after checking user permissions.
 *
 * @param id - ID of the reservation to delete.
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @returns A promise that resolves when the reservation is deleted.
 */
export async function deleteAdminReservation(
    id: string,
    userId: string,
    role: UserRole,
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

    await assertCanManageCamping(userId, role, reservation.spot.campingId);

    await prisma.reservation.delete({
        where: { id },
    });
}

/**
 * Updates a reservation's status and sends an email notification if changed.
 *
 * @param id - ID of the reservation to update.
 * @param status - New reservation status.
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @returns The reservation with its current status and camping details.
 */
export async function updateAdminReservationStatus(
    id: string,
    status: ReservationStatus,
    userId: string,
    role: UserRole,
) {
    const existingReservation = await prisma.reservation.findUnique({
        where: { id },
        select: {
            id: true,
            status: true,
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
        existingReservation.spot.campingId,
    );

    // Skip the notification if the status has not changed.
    if (existingReservation.status === status) {
        return prisma.reservation.findUnique({
            where: { id },
            include: reservationInclude,
        });
    }

    const reservation = await prisma.reservation.update({
        where: { id },
        data: {
            status,
        },
        include: reservationInclude,
    });

    try {
        await sendReservationStatusNotification(reservation.id, status);
    } catch (error) {
        console.error("Failed to send reservation status notification", {
            reservationId: reservation.id,
            status,
            error,
        });
    }

    return reservation;
}
