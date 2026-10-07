import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";

import type { BlookersReservationBody } from "../schemas/blookersReservationSchema.js";

import { sendReservationNotifications } from "./reservationNotificationService.js";
import { calculateTotalPrice } from "../utils/calculateTotalPrice.js";

export async function createBlookersReservation(
    data: BlookersReservationBody
) {
    const existingExternalReservation =
        await prisma.reservation.findUnique({
            where: {
                source_externalReservationId: {
                    source: "BLOOKERS",
                    externalReservationId: data.reservationId,
                },
            },
        });

    if (existingExternalReservation) {
        throw new ValidationError(
            "This Blookers reservation already exists"
        );
    }

    const spot = await prisma.spot.findUnique({
        where: {
            externalBookingId: data.externalSpotId,
        },
    });

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    const totalPrice = calculateTotalPrice(
        data.arrivalDate,
        data.departureDate,
        spot.pricePerNight
    );

    if (data.guests > spot.capacity) {
        throw new ValidationError(
            "Too many guests for this camping spot"
        );
    }

    const conflictingReservation =
        await prisma.reservation.findFirst({
            where: {
                spotId: spot.id,
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

    if (conflictingReservation) {
        throw new ValidationError(
            "This camping spot is already reserved for the selected dates"
        );
    }

    const reservation = await prisma.reservation.create({
        data: {
            spotId: spot.id,

            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,

            guests: data.guests,
            arrivalDate: data.arrivalDate,
            departureDate: data.departureDate,

            pricePerNight: spot.pricePerNight,
            totalPrice,

            ...(data.notes
                ? { notes: data.notes }
                : {}),

            source: "BLOOKERS",
            externalReservationId: data.reservationId,
            status: "PENDING",
        },
    });

    try {
        await sendReservationNotifications(
            reservation.id
        );
    } catch (error) {
        console.error(
            "Failed to send Blookers reservation notifications",
            {
                reservationId: reservation.id,
                externalReservationId:
                    data.reservationId,
                error,
            }
        );
    }

    return reservation;
}