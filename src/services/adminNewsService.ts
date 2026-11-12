/**
 * @file adminNewsService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-15
 */

import { prisma } from "../prisma.js";
import {
    type CreateAdminNewsBody,
    type UpdateAdminNewsBody,
} from "../schemas/adminNewsSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";

/**
 * Retrieves a specific news item by its ID.
 *
 * @param id - ID of the requested news item.
 * @returns The requested news item, or null if not found.
 */
export async function getAdminNewsById(id: string) {
    return prisma.newsItem.findUnique({
        where: { id },
    });
}

/**
 * Creates a new news item using the provided details.
 *
 * @param data - Validated news details, including the image URL.
 * @returns The newly created news item.
 */
export async function createAdminNews(data: CreateAdminNewsBody) {
    return prisma.newsItem.create({
        data: {
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            date: data.date,
            imageUrl: data.imageUrl,
        },
    });
}

/**
 * Updates an existing news item while preserving its image if unchanged.
 *
 * @param id - ID of the news item to update.
 * @param data - Validated news details.
 * @returns The updated news item.
 */
export async function updateAdminNews(id: string, data: UpdateAdminNewsBody) {
    const existingNewsItem = await prisma.newsItem.findUnique({
        where: { id },
    });

    if (!existingNewsItem) {
        throw new NotFoundError("News item");
    }

    return prisma.newsItem.update({
        where: { id },
        data: {
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            date: data.date,
            imageUrl: data.imageUrl ?? existingNewsItem.imageUrl,
        },
    });
}

/**
 * Deletes a news item by its ID.
 *
 * @param id - ID of the news item to delete.
 * @returns A promise that resolves when the news item is deleted.
 */
export async function deleteAdminNews(id: string) {
    const newsItem = await prisma.newsItem.findUnique({
        where: { id },
    });

    if (!newsItem) {
        throw new NotFoundError("News item");
    }

    await prisma.newsItem.delete({
        where: { id },
    });
}
