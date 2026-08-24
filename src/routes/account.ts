import { Router } from "express";

import { customerAuth } from "../middleware/customerAuth.js";

import {
    register,
    login,
    logout,
    me,
    getMyReservations,
} from "../controllers/accountController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", customerAuth, me);
router.get(
    "/reservations",
    customerAuth,
    getMyReservations
);

export default router;