import { Router } from "express";
import { getNewsItem, getNewsItems } from "../controllers/newsController.js";

const router = Router();

router.get("/", getNewsItems);
router.get("/:id", getNewsItem);

export default router;