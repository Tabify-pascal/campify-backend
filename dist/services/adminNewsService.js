import { prisma } from "../prisma.js";
import {} from "../schemas/adminNewsSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";
export async function getAdminNewsById(id) {
    return prisma.newsItem.findUnique({
        where: { id },
    });
}
export async function createAdminNews(data) {
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
export async function updateAdminNews(id, data) {
    const existingNewsItem = await prisma.newsItem.findUnique({
        where: { id },
    });
    if (!existingNewsItem) {
        throw new NotFoundError("News item");
    }
    ;
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
export async function deleteAdminNews(id) {
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
//# sourceMappingURL=adminNewsService.js.map