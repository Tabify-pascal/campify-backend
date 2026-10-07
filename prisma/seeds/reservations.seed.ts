import type { PrismaClient } from "@prisma/client";
import type { SeedSpots } from "./spots.seed.js";

export async function seedReservations(
    prisma: PrismaClient,
    spots: SeedSpots
) {
    await prisma.reservation.create({
        data: {
            spotId: spots.bosSpot.id,

            firstName: "Jan",
            lastName: "Jansen",
            email: "jan@example.com",
            phone: "0612345678",

            guests: 2,
            arrivalDate: new Date("2026-11-10"),
            departureDate: new Date("2026-11-14"),

            notes: "Graag een rustige plek.",
            pricePerNight: 35,
            totalPrice: 140,

            status: "PENDING",
            source: "CAMPIFY",
        },
    });

    await prisma.reservation.create({
        data: {
            spotId: spots.meerSpot.id,

            firstName: "Sophie",
            lastName: "De Vries",
            email: "sophie@example.com",
            phone: "0687654321",

            guests: 3,
            arrivalDate: new Date("2026-12-01"),
            departureDate: new Date("2026-12-05"),

            notes: "Reservering via Blookers.",
            pricePerNight: 42,
            totalPrice: 168,

            status: "CONFIRMED",
            source: "BLOOKERS",
            externalReservationId: "BLK-DEMO-1001",
        },
    });
}