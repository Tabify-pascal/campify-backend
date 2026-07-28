import { type Request, type Response } from "express";
import { getAllNewsItems, getNewsItemById } from "../services/newsService.js";
import { type NewsParams } from "../types/news.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export const getNewsItems = asyncHandler(async(_req: Request, res: Response) => {
    const newsItems = await getAllNewsItems();

    res.json(newsItems);
});

export const getNewsItem = asyncHandler<NewsParams>(async(
    req: Request<NewsParams>, res: Response
    ) => {
    const newsItem = await getNewsItemById(req.params.newsId);

    if (!newsItem) {
        throw new NotFoundError("News item");
    }

    res.json(newsItem);
});