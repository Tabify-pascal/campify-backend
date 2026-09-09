import { z } from "zod";
export const contactMessageStatusSchema = z.object({
    status: z.enum([
        "NEW",
        "READ",
        "CLOSED",
    ]),
});
//# sourceMappingURL=contactMessageStatusSchema.js.map