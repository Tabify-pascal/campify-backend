import { prisma } from "../prisma.js";

export async function getAllFaqItems(){
    return prisma.faqItem.findMany({
        orderBy: {
            question: "asc",
        },
    });
}