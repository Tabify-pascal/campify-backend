import { z } from "zod";
export const spotSearchSchema = z
    .object({
    campingId: z.string().optional(),
    arrivalDate: z.coerce.date().optional(),
    departureDate: z.coerce.date().optional(),
    guests: z.coerce.number().int().min(1).optional(),
})
    .refine((data) => !data.arrivalDate ||
    !data.departureDate ||
    data.departureDate > data.arrivalDate, {
    message: "departureDate must be after arrivalDate",
    path: ["departureDate"],
});
//# sourceMappingURL=spotSearchSchema.js.map