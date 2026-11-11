/**
 * @file adminNewsController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-15
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createAdminNewsSchema,
    updateAdminNewsSchema,
} from "../schemas/adminNewsSchema.js";
import {
    createAdminNews,
    deleteAdminNews,
    updateAdminNews,
} from "../services/adminNewsService.js";
import { type Request, type Response } from "express";
import {
    type CreateAdminNewsBody,
    type UpdateAdminNewsBody,
} from "../schemas/adminNewsSchema.js";
import { type NewsParams } from "../types/news.js";
import { ValidationError } from "../errors/ValidationError.js";


/**
 * Validates and creates a news item with an uploaded image.
 *
 * @param req - Request containing the news details and uploaded image.
 * @param res - Response object.
 * @returns HTTP 201 with the created news item.
 */
export const createNews = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, CreateAdminNewsBody>,
        res: Response,
    ) => {
        if (!req.file) {
            throw new ValidationError("News image is required");
        }

        const data = createAdminNewsSchema.parse({
            ...req.body,
            imageUrl: `/uploads/news/${req.file.filename}`,
        });

        const news = await createAdminNews(data);

        res.status(201).json(news);
    },
);


/**
 * Validates and updates an existing news item with an optional image.
 *
 * @param req - Request containing the news ID, updated details and optional image.
 * @param res - Response object.
 * @returns JSON containing the updated news item.
 */
export const updateNews = asyncHandler<NewsParams>(
    async (
        req: Request<NewsParams, unknown, UpdateAdminNewsBody>,
        res: Response,
    ) => {
        const data = updateAdminNewsSchema.parse({
            ...req.body,
            ...(req.file && {
                imageUrl: `/uploads/news/${req.file.filename}`,
            }),
        });

        const news = await updateAdminNews(req.params.newsId, data);

        res.json(news);
    },
);


/**
 * Deletes a news item by its ID.
 *
 * @param req - Request containing the news ID.
 * @param res - Response object.
 * @returns HTTP 204 with no content.
 */
export const deleteNews = asyncHandler<NewsParams>(async (req, res) => {
    await deleteAdminNews(req.params.newsId);
    res.status(204).send();
});
