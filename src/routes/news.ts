/**
 * @file news.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { Router } from "express";
import { getNewsItem, getNewsItems } from "../controllers/newsController.js";

const router = Router();

router.get("/", getNewsItems);
router.get("/:newsId", getNewsItem);

export default router;