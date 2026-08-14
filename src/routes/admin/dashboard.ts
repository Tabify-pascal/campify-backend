import { Router } from "express";

import { adminAuth } from "../../middleware/adminAuth.js";
import { getDashboardSummary } from "../../controllers/adminDashboardController.js";

const router = Router();

router.use(adminAuth);

router.get("/", getDashboardSummary);

export default router;