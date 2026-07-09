import { type ReservationBody } from "../schemas/reservationSchema.js";
import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";

export async function createReservation(data: ReservationBody) {
    const spot = await prisma.spot.findUnique({
        where: { id: data.spotId },
    });

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    if (data.guests > spot.capacity){
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

    return prisma.reservation.create({
        data: {
            spotId: data.spotId,
            firstName: data.firstName,
            lastName: data.lastName, 
            email: data.email,
            phone: data.phone,
            guests: data.guests,
            arrivalDate: data.arrivalDate,
            departureDate: data.departureDate,
            ...(data.notes ? {notes: data.notes} : {}),
        },
    });
}