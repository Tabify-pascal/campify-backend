/**
 * @file campings.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

import { Router } from "express";

import {
    index,
    show,
} from "../controllers/campingController.js";

const router = Router();

router.get("/", index);
router.get("/:campingId", show);

export default router;