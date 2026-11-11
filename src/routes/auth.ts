/**
 * @file auth.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-16
 */

import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    verifyEmailAddress,
    resendVerification
} from "../controllers/authController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-email", verifyEmailAddress);
router.post("/resend-verification", resendVerification);
router.get("/me", requireAuth, getCurrentUser);

export default router;