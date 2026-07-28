import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { createFaq, updateFaq, deleteFaq, getFaqs, getFaqById } from "../../controllers/adminFaqController.js";

const router = Router();

router.use(adminAuth);

router.get("/", getFaqs);
router.get("/:faqId", getFaqById);
router.post("/", createFaq);
router.put("/:faqId", updateFaq);
router.delete("/:faqId", deleteFaq);

export default router;
