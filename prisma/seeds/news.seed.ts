import type { PrismaClient } from "@prisma/client";

export async function seedNews(prisma: PrismaClient) {
    await prisma.newsItem.createMany({
        data: [
            {
                title: "Nieuw sanitair geopend",
                excerpt:
                    "Ons vernieuwde sanitairgebouw is klaar voor gebruik.",
                content:
                    "Na maanden van renovatie is ons nieuwe sanitairgebouw officieel geopend. Gasten kunnen gebruikmaken van ruime douches en familiebadkamers.",
                date: new Date("2026-05-01"),
                imageUrl: "/images/news/sanitair.jpg",
            },
            {
                title: "Zomeractiviteiten bekend",
                excerpt:
                    "Bekijk het activiteitenprogramma voor deze zomer.",
                content:
                    "Deze zomer organiseren we onder andere speurtochten, kampvuren, yoga in de buitenlucht en mountainbiketochten.",
                date: new Date("2026-06-10"),
                imageUrl:
                    "/images/news/zomeractiviteiten.jpg",
            },
            {
                title: "Nieuwe speeltuin",
                excerpt:
                    "De speeltuin is uitgebreid met nieuwe toestellen.",
                content:
                    "Kinderen kunnen zich uitleven op de nieuwe klimtoren, kabelbaan en waterbaan.",
                date: new Date("2026-06-20"),
                imageUrl: "/images/news/speeltuin.jpg",
            },
        ],
    });
}