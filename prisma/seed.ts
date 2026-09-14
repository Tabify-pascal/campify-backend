import { PrismaClient } from "@prisma/client";
import "dotenv/config";

import { seedAdmin } from "./seeds/admin.seed.js";
import { seedCampings } from "./seeds/campings.seed.js";
import { seedManagers } from "./seeds/managers.seed.js";
import { seedSpots } from "./seeds/spots.seed.js";
import { seedNews } from "./seeds/news.seed.js";
import { seedFaq } from "./seeds/faq.seed.js";

const prisma = new PrismaClient();

async function main() {
    await prisma.reservation.deleteMany();
    await prisma.contactMessage.deleteMany();

    // Must be deleted before users/campings.
    await prisma.campingManager.deleteMany();

    await prisma.spotFeature.deleteMany();
    await prisma.spot.deleteMany();
    await prisma.camping.deleteMany();

    await prisma.newsItem.deleteMany();
    await prisma.faqItem.deleteMany();

    await seedAdmin(prisma);

    const campings = await seedCampings(prisma);

    await seedManagers(prisma, campings);
    await seedSpots(prisma, campings);
    await seedNews(prisma);
    await seedFaq(prisma);

    console.log("Database seeded");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });