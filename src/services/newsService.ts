/**
 * @file newsService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { prisma } from "../prisma.js";

export async function getAllNewsItems() {
    return prisma.newsItem.findMany({
        orderBy: {
            date: "desc",
        },
    });
}

export async function getNewsItemById(newsId: string){
    return prisma.newsItem.findUnique({
        where: { id : newsId },
    });
}