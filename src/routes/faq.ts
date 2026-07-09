import { Router } from "express";
import { getFaqItems } from "../controllers/faqController.js";

const router = Router();

router.get("/", getFaqItems);

export default router;