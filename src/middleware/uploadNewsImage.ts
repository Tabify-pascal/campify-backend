/**
 * @file uploadNewsImage.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-13
 */

import { createImageUpload } from "./createImageUpload.js";

/**
 * Configures middleware for uploading news images.
 */
export const uploadNewsImage = createImageUpload("uploads/news");
