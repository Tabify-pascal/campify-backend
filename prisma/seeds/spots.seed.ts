import type { PrismaClient } from "@prisma/client";
import type { SeedCampings } from "./campings.seed.js";

export async function seedSpots(
    prisma: PrismaClient,
    campings: SeedCampings
) {
    const bosSpot = await prisma.spot.create({
        data: {
            campingId: campings.bosCamping.id,
            externalBookingId: "BOSRAND-BOSZICHT",

            name: "Boszicht",
            description:
                "Ruime kampeerplaats aan de bosrand.",
            capacity: 6,
            pricePerNight: 35,
            imageUrl: "/images/spots/boszicht.jpg",
            size: 120,
            electricity: true,
            waterConnection: false,

            features: {
                create: [
                    { name: "Aan de bosrand" },
                    { name: "Ruime plek" },
                    { name: "Geschikt voor gezinnen" },
                ],
            },
        },
    });

    const meerSpot = await prisma.spot.create({
        data: {
            campingId: campings.meerCamping.id,
            externalBookingId: "HETMEER-MEERZICHT",

            name: "Meerzicht",
            description:
                "Geniet van een prachtig uitzicht over het meer.",
            capacity: 4,
            pricePerNight: 42,
            imageUrl: "/images/spots/meerzicht.jpg",
            size: 100,
            electricity: true,
            waterConnection: true,

            features: {
                create: [
                    { name: "Direct aan het water" },
                    { name: "Eigen wateraansluiting" },
                    { name: "Ideaal voor vissers" },
                ],
            },
        },
    });

    return {
        bosSpot,
        meerSpot,
    };
}

export type SeedSpots = Awaited<
    ReturnType<typeof seedSpots>
>;