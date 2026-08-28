import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { uploadNewsImage } from "../../middleware/uploadNewsImage.js";
import { createNews, updateNews, deleteNews } from "../../controllers/adminNewsController.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.post("/", uploadNewsImage.single("image"), createNews);

router.put("/:newsId", uploadNewsImage.single("image"), updateNews);

router.delete("/:newsId", deleteNews );

export default router;
