import { prisma } from "../prisma.js";

export async function getAllNewsItems() {
    return prisma.newsItem.findMany({
        orderBy: {
            date: "desc",
        },
    });
}

export async function getNewsItemById(id: string){
    return prisma.newsItem.findUnique({
        where: { id },
    });
}