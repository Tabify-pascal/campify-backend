import { prisma } from "../prisma.js";
export async function getAllNewsItems() {
    return prisma.newsItem.findMany({
        orderBy: {
            date: "desc",
        },
    });
}
export async function getNewsItemById(newsId) {
    return prisma.newsItem.findUnique({
        where: { id: newsId },
    });
}
//# sourceMappingURL=newsService.js.map