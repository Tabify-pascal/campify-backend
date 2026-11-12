/**
 * @file newsService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { prisma } from "../prisma.js";

/**
 * Retrieves all news items sorted by date, newest first.
 *
 * @returns A list of news items.
 */
export async function getAllNewsItems() {
    return prisma.newsItem.findMany({
        orderBy: {
            date: "desc",
        },
    });
}

/**
 * Retrieves a specific news item by its ID.
 *
 * @param newsId - ID of the requested news item.
 * @returns The requested news item, or null if not found.
 */
export async function getNewsItemById(newsId: string) {
    return prisma.newsItem.findUnique({
        where: { id: newsId },
    });
}
