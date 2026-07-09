import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    await prisma.reservation.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.spotFeature.deleteMany();
    await prisma.spot.deleteMany();
    await prisma.newsItem.deleteMany();
    await prisma.faqItem.deleteMany();

    await prisma.spot.create({
        data: {
            name: "Boszicht",
            description: "Ruime kampeerplaats aan de bosrand.",
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

    await prisma.spot.create({
        data: {
            name: "Meerzicht",
            description: "Geniet van een prachtig uitzicht over het meer.",
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

    await prisma.newsItem.createMany({
        data: [
            {
                title: "Nieuw sanitair geopend",
                excerpt: "Ons vernieuwde sanitairgebouw is klaar voor gebruik.",
                content:
                    "Na maanden van renovatie is ons nieuwe sanitairgebouw officieel geopend. Gasten kunnen gebruikmaken van ruime douches en familiebadkamers.",
                date: new Date("2026-05-01"),
                imageUrl: "/images/news/sanitair.jpg",
            },
            {
                title: "Zomeractiviteiten bekend",
                excerpt: "Bekijk het activiteitenprogramma voor deze zomer.",
                content:
                    "Deze zomer organiseren we onder andere speurtochten, kampvuren, yoga in de buitenlucht en mountainbiketochten.",
                date: new Date("2026-06-10"),
                imageUrl: "/images/news/zomeractiviteiten.jpg",
            },
            {
                title: "Nieuwe speeltuin",
                excerpt: "De speeltuin is uitgebreid met nieuwe toestellen.",
                content:
                    "Kinderen kunnen zich uitleven op de nieuwe klimtoren, kabelbaan en waterbaan.",
                date: new Date("2026-06-20"),
                imageUrl: "/images/news/speeltuin.jpg",
            },
        ],
    });

    console.log("Database seeded");


    await prisma.faqItem.createMany({
        data: [
            {
                question: "Vanaf hoe laat kan ik inchecken?",
                answer: "Inchecken kan vanaf 14:00 uur.",
            },
            {
                question: "Tot hoe laat kan ik uitchecken?",
                answer: "Uitchecken kan tot 11:00 uur.",
            },
            {
                question: "Zijn honden toegestaan?",
                answer: "Ja, honden zijn welkom op onze camping, mits aangelijnd.",
            },
            {
                question: "Is er stroom op de kampeerplaatsen?",
                answer: "Een deel van de kampeerplaatsen heeft stroom. Dit staat per plek aangegeven.",
            },
            {
                question: "Kan ik mijn reservering wijzigen?",
                answer: "Neem contact met ons op, dan kijken we samen naar de mogelijkheden.",
            },
        ],
    });
}


main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });