import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { getMyReservations } from "../controllers/accountController.js";
const router = Router();
router.get("/reservations", requireAuth, requireRole("CUSTOMER"), getMyReservations);
export default router;
//# sourceMappingURL=account.js.map