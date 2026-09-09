import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { getDashboardSummary } from "../../controllers/adminDashboardController.js";
const router = Router();
router.use(requireAuth);
router.use(requireRole("ADMIN"));
router.get("/", getDashboardSummary);
export default router;
//# sourceMappingURL=dashboard.js.map