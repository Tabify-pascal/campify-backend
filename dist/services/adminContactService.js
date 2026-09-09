import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
export async function getAdminContactMessages() {
    return prisma.contactMessage.findMany({
        orderBy: [
            { status: "asc" },
            { createdAt: "desc" },
        ],
    });
}
export async function getAdminContactMessageById(messageId) {
    const message = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
    });
    if (!message) {
        throw new NotFoundError("Contact message");
    }
    return message;
}
export async function updateAdminContactMessageStatus(messageId, status) {
    const existingMessage = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
        select: {
            id: true,
        },
    });
    if (!existingMessage) {
        throw new NotFoundError("Contact message");
    }
    return prisma.contactMessage.update({
        where: {
            id: messageId,
        },
        data: {
            status,
        },
    });
}
export async function deleteAdminContactMessage(messageId) {
    const existingMessage = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
        select: {
            id: true,
        },
    });
    if (!existingMessage) {
        throw new NotFoundError("Contact message");
    }
    await prisma.contactMessage.delete({
        where: {
            id: messageId,
        }
    });
}
//# sourceMappingURL=adminContactService.js.map