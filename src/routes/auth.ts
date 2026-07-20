import { Router } from "express";
import { loginUser, getCurrentUser, logoutUser } from "../controllers/authController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", adminAuth, getCurrentUser);

export default router;