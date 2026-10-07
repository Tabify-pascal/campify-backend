import { type ReservationBody } from "../schemas/reservationSchema.js";
import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { sendReservationNotifications } from "./reservationNotificationService.js";
import type { PaymentStatus } from "@prisma/client";
import { calculateTotalPrice } from "../utils/calculateTotalPrice.js";

export async function createReservation(data: ReservationBody) {
    const spot = await prisma.spot.findUnique({
        where: { id: data.spotId },
    });

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    if (data.guests > spot.capacity) {
        throw new Error("Too many guests for this camping spot");
    }

    const existingReservation = await prisma.reservation.findFirst({
        where: {
            spotId: data.spotId,
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
            "This camping spot is already reserved for the selected dates."
        );
    }

    const totalPrice = calculateTotalPrice(
        data.arrivalDate,
        data.departureDate,
        spot.pricePerNight
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
        await sendReservationNotifications(
            reservation.id
        );
    } catch (error) {
        console.error(
            "Failed to send reservation manager notification",
            {
                reservationId: reservation.id,
                error,
            }
        );
    }

    return reservation;
}

export async function updateReservationPaymentStatus(
    reservationId: string,
    paymentStatus: PaymentStatus
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

export async function getReservationCheckoutSummary(
    reservationId: string
) {
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