/**
 * @file reservationService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { type ReservationBody } from "../schemas/reservationSchema.js";
import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { sendReservationNotifications } from "./reservationNotificationService.js";
import type { PaymentStatus } from "@prisma/client";
import { calculateTotalPrice } from "../utils/calculateTotalPrice.js";

/**
 * Creates a reservation after validating the camping spot and availability.
 *
 * @param data - Validated reservation details.
 * @returns The newly created reservation with its calculated total price.
 */
export async function createReservation(data: ReservationBody) {
    const spot = await prisma.spot.findUnique({
        where: { id: data.spotId },
    });

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    if (data.guests > spot.capacity) {
        throw new ValidationError("Too many guests for this camping spot");
    }

    const existingReservation = await prisma.reservation.findFirst({
        where: {
            spotId: data.spotId,
            status: {
                in: ["PENDING", "CONFIRMED"],
            },
            arrivalDate: {
                lt: data.departureDate,
            },
            departureDate: {
                gt: data.arrivalDate,
            },
        },
    });

    if (existingReservation) {
        throw new ValidationError(
            "This camping spot is already reserved for the selected dates.",
        );
    }

    const totalPrice = calculateTotalPrice(
        data.arrivalDate,
        data.departureDate,
        spot.pricePerNight,
    );

    const reservation = await prisma.reservation.create({
        data: {
            spotId: data.spotId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            guests: data.guests,
            arrivalDate: data.arrivalDate,
            departureDate: data.departureDate,

            pricePerNight: spot.pricePerNight,
            totalPrice,

            ...(data.notes ? { notes: data.notes } : {}),
        },
    });

    try {
        await sendReservationNotifications(reservation.id);
    } catch (error) {
        console.error("Failed to send reservation manager notification", {
            reservationId: reservation.id,
            error,
        });
    }

    return reservation;
}

/**
 * Updates the simulated payment status of an existing reservation.
 *
 * @param reservationId - ID of the reservation to update.
 * @param paymentStatus - New payment status.
 * @returns The reservation with its updated payment status.
 */
export async function updateReservationPaymentStatus(
    reservationId: string,
    paymentStatus: PaymentStatus,
) {
    const reservation = await prisma.reservation.findUnique({
        where: {
            id: reservationId,
        },
        select: {
            id: true,
        },
    });

    if (!reservation) {
        throw new NotFoundError("Reservation");
    }

    return prisma.reservation.update({
        where: {
            id: reservationId,
        },
        data: {
            paymentStatus,
        },
    });
}

/**
 * Retrieves the checkout summary for a specific reservation.
 *
 * @param reservationId - ID of the requested reservation.
 * @returns The reservation summary with payment, pricing and camping details.
 */
export async function getReservationCheckoutSummary(reservationId: string) {
    const reservation = await prisma.reservation.findUnique({
        where: {
            id: reservationId,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            guests: true,
            arrivalDate: true,
            departureDate: true,
            status: true,
            paymentStatus: true,
            pricePerNight: true,
            totalPrice: true,
            spot: {
                select: {
                    id: true,
                    name: true,
                    camping: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!reservation) {
        throw new NotFoundError("Reservation");
    }

    return reservation;
}
