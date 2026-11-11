/**
 * @file contact.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { Router } from "express";
import { createContact } from "../controllers/contactController.js";

const router = Router();

router.post("/", createContact);

export default router;