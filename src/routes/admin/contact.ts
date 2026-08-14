import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { getContactMessages, getContactMessageById, updateContactMessageStatus, deleteContactMessage } from "../../controllers/adminContactController.js";

const router = Router();

router.use(adminAuth);

router.get("/", getContactMessages);
router.get("/:messageId", getContactMessageById);
router.delete("/:messageId", deleteContactMessage);
router.patch("/:messageId/status", updateContactMessageStatus);

export default router;
