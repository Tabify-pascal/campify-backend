import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
export async function getAdminFaqs() {
    return prisma.faqItem.findMany({
        orderBy: {
            question: "asc"
        },
    });
}
export async function getAdminFaqById(faqId) {
    const faqItem = await prisma.faqItem.findUnique({
        where: { id: faqId },
    });
    if (!faqItem) {
        throw new NotFoundError("Faq item");
    }
    return faqItem;
}
export async function createAdminFaq(data) {
    return prisma.faqItem.create({
        data: {
            question: data.question,
            answer: data.answer,
        }
    });
}
export async function updateAdminFaq(faqId, data) {
    const existingFaqItem = await prisma.faqItem.findUnique({
        where: { id: faqId },
    });
    if (!existingFaqItem) {
        throw new NotFoundError("Faq item");
    }
    return prisma.faqItem.update({
        where: { id: faqId },
        data: {
            question: data.question,
            answer: data.answer,
        }
    });
}
export async function deleteAdminFaq(faqId) {
    const faqItem = await prisma.faqItem.findUnique({
        where: { id: faqId },
    });
    if (!faqItem) {
        throw new NotFoundError("Faq item");
    }
    await prisma.faqItem.delete({
        where: { id: faqId },
    });
}
//# sourceMappingURL=adminFaqService.js.map