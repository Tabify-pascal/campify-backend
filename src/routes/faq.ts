/**
 * @file faq.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { Router } from "express";
import { getFaqItems } from "../controllers/faqController.js";

const router = Router();

router.get("/", getFaqItems);

export default router;
