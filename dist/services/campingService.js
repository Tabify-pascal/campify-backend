import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
export async function getCampings() {
    return prisma.camping.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
export async function getCampingById(campingId) {
    const camping = await prisma.camping.findUnique({
        where: {
            id: campingId,
        },
    });
    if (!camping) {
        throw new NotFoundError("Camping");
    }
    return camping;
}
//# sourceMappingURL=campingService.js.map