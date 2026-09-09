import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { createFaq, updateFaq, deleteFaq, getFaqs, getFaqById } from "../../controllers/adminFaqController.js";
const router = Router();
router.use(requireAuth);
router.use(requireRole("ADMIN"));
router.get("/", getFaqs);
router.get("/:faqId", getFaqById);
router.post("/", createFaq);
router.put("/:faqId", updateFaq);
router.delete("/:faqId", deleteFaq);
export default router;
//# sourceMappingURL=faqs.js.map