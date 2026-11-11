/**
 * @file newsController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { type Request, type Response } from "express";
import { getAllNewsItems, getNewsItemById } from "../services/newsService.js";
import { type NewsParams } from "../types/news.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";


/**
 * Retrieves all news items for the public news page.
 *
 * @param _req - Unused request object.
 * @param res - Response object.
 * @returns JSON containing all news items.
 */
export const getNewsItems = asyncHandler(
    async (_req: Request, res: Response) => {
        const newsItems = await getAllNewsItems();

        res.json(newsItems);
    },
);


/**
 * Retrieves a specific news item by its ID.
 *
 * @param req - Request containing the news ID.
 * @param res - Response object.
 * @returns JSON containing the requested news item.
 */
export const getNewsItem = asyncHandler<NewsParams>(
    async (req: Request<NewsParams>, res: Response) => {
        const newsItem = await getNewsItemById(req.params.newsId);

        if (!newsItem) {
            throw new NotFoundError("News item");
        }

        res.json(newsItem);
    },
);
