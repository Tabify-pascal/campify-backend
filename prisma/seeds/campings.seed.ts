import type { PrismaClient } from "@prisma/client";

export async function seedCampings(prisma: PrismaClient) {
    const bosCamping = await prisma.camping.create({
        data: {
            name: "Camping De Bosrand",
            slug: "camping-de-bosrand",
            description:
                "Een rustige camping midden in het groen.",
            logoUrl: "/images/campings/de-bosrand.png",
        },
    });

    const meerCamping = await prisma.camping.create({
        data: {
            name: "Camping Het Meer",
            slug: "camping-het-meer",
            description:
                "Kamperen aan het water met uitzicht over het meer.",
            logoUrl: "/images/campings/het-meer.png",
        },
    });

    return {
        bosCamping,
        meerCamping,
    };
}

export type SeedCampings = Awaited<
    ReturnType<typeof seedCampings>
>;