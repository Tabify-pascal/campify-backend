import { asyncHandler } from "../utils/asyncHandler.js";
import { createAdminNewsSchema, updateAdminNewsSchema } from "../schemas/adminNewsSchema.js";
import { createAdminNews, deleteAdminNews, updateAdminNews } from "../services/adminNewsService.js";
import {} from "express";
import {} from "../schemas/adminNewsSchema.js";
import {} from "../types/news.js";
import { ValidationError } from "../errors/ValidationError.js";
export const createNews = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ValidationError("News image is required");
    }
    const data = createAdminNewsSchema.parse({
        ...req.body,
        imageUrl: `/uploads/news/${req.file.filename}`
    });
    const news = await createAdminNews(data);
    res.status(201).json(news);
});
export const updateNews = asyncHandler(async (req, res) => {
    const data = updateAdminNewsSchema.parse({
        ...req.body,
        ...(req.file && {
            imageUrl: `/uploads/news/${req.file.filename}`,
        }),
    });
    const news = await updateAdminNews(req.params.newsId, data);
    res.json(news);
});
export const deleteNews = asyncHandler(async (req, res) => {
    await deleteAdminNews(req.params.newsId);
    res.status(204).send();
});
//# sourceMappingURL=adminNewsController.js.map