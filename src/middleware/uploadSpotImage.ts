/**
 * @file uploadSpotImage.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-13
 */

import { createImageUpload } from "./createImageUpload.js";

/**
 * Configures middleware for uploading camping spot images.
 */
export const uploadSpotImage = createImageUpload("uploads/spots");
