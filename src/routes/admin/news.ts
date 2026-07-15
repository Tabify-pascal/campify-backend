import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { uploadNewsImage } from "../../middleware/uploadNewsImage.js";
import { createNews, updateNews, deleteNews } from "../../controllers/adminNewsController.js";

const router = Router();

router.use(adminAuth);

router.post("/", uploadNewsImage.single("image"), createNews);

router.put("/:id", uploadNewsImage.single("image"), updateNews);

router.delete("/:id", deleteNews );

export default router;
