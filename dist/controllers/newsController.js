import {} from "express";
import { getAllNewsItems, getNewsItemById } from "../services/newsService.js";
import {} from "../types/news.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";
export const getNewsItems = asyncHandler(async (_req, res) => {
    const newsItems = await getAllNewsItems();
    res.json(newsItems);
});
export const getNewsItem = asyncHandler(async (req, res) => {
    const newsItem = await getNewsItemById(req.params.newsId);
    if (!newsItem) {
        throw new NotFoundError("News item");
    }
    res.json(newsItem);
});
//# sourceMappingURL=newsController.js.map