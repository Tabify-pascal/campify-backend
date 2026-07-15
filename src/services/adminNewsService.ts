import { prisma } from "../prisma.js";
import { type CreateAdminNewsBody, type UpdateAdminNewsBody } from "../schemas/adminNewsSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function getAdminNewsById(id: string) {
    return prisma.newsItem.findUnique({
        where: { id },
    });
}

export async function createAdminNews(data: CreateAdminNewsBody){
    return prisma.newsItem.create({
        data: {
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            date: data.date,
            imageUrl: data.imageUrl,
        }
    });
}

export async function updateAdminNews(id: string, data: UpdateAdminNewsBody){
    const existingNewsItem = await prisma.newsItem.findUnique({
        where: { id },
    });

    if ( !existingNewsItem){
        throw new NotFoundError("News item");
    };

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

export async function deleteAdminNews(id: string){
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

