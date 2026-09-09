import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { getContactMessages, getContactMessageById, updateContactMessageStatus, deleteContactMessage } from "../../controllers/adminContactController.js";
const router = Router();
router.use(requireAuth);
router.use(requireRole("ADMIN"));
router.get("/", getContactMessages);
router.get("/:messageId", getContactMessageById);
router.delete("/:messageId", deleteContactMessage);
router.patch("/:messageId/status", updateContactMessageStatus);
export default router;
//# sourceMappingURL=contact.js.map