import {} from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminCampingSchema } from "../schemas/adminCampingSchema.js";
import {} from "../types/camping.js";
import { getAdminCampings, getAdminCampingById, createAdminCamping, updateAdminCamping, deleteAdminCamping, } from "../services/adminCampingService.js";
export const getCampings = asyncHandler(async (_req, res) => {
    const campings = await getAdminCampings();
    res.json(campings);
});
export const getCampingById = asyncHandler(async (req, res) => {
    const camping = await getAdminCampingById(req.params.campingId);
    res.json(camping);
});
export const createCamping = asyncHandler(async (req, res) => {
    const data = adminCampingSchema.parse(req.body);
    const camping = await createAdminCamping(data);
    res.status(201).json(camping);
});
export const updateCamping = asyncHandler(async (req, res) => {
    const data = adminCampingSchema.parse(req.body);
    const camping = await updateAdminCamping(req.params.campingId, data);
    res.json(camping);
});
export const deleteCamping = asyncHandler(async (req, res) => {
    await deleteAdminCamping(req.params.campingId);
    res.status(204).send();
});
//# sourceMappingURL=adminCampingController.js.map