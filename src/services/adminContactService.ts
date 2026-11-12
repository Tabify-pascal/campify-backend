/**
 * @file adminContactService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-08-06
 */

import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { assertCanManageCamping } from "../utils/assertCanManageCamping.js";

import type { ContactMessageStatus } from "@prisma/client";
import type { UserRole } from "../types/user.js";

const messageInclude = {
    camping: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
};

/**
 * Retrieves all contact messages accessible to an admin or manager.
 *
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @returns A list of contact messages, sorted by status and creation date.
 */
export async function getAdminContactMessages(userId: string, role: UserRole) {
    return prisma.contactMessage.findMany({
        where:
            role === "ADMIN"
                ? {}
                : {
                      camping: {
                          managers: {
                              some: {
                                  userId,
                              },
                          },
                      },
                  },

        include: messageInclude,

        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
}

/**
 * Retrieves a contact message by its ID after checking user permissions.
 *
 * @param messageId - ID of the requested contact message.
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @returns The requested contact message with camping details.
 */
export async function getAdminContactMessageById(
    messageId: string,
    userId: string,
    role: UserRole,
) {
    const message = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
        include: messageInclude,
    });

    if (!message) {
        throw new NotFoundError("Contact message");
    }

    await assertCanManageCamping(userId, role, message.campingId);

    return message;
}

/**
 * Updates the status of a contact message after checking user permissions.
 *
 * @param messageId - ID of the contact message to update.
 * @param status - New status of the contact message.
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @returns The updated contact message with camping details.
 */
export async function updateAdminContactMessageStatus(
    messageId: string,
    status: ContactMessageStatus,
    userId: string,
    role: UserRole,
) {
    const existingMessage = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
        select: {
            id: true,
            campingId: true,
        },
    });

    if (!existingMessage) {
        throw new NotFoundError("Contact message");
    }

    await assertCanManageCamping(userId, role, existingMessage.campingId);

    return prisma.contactMessage.update({
        where: {
            id: messageId,
        },
        data: {
            status,
        },
        include: messageInclude,
    });
}

/**
 * Deletes a contact message after checking user permissions.
 *
 * @param messageId - ID of the contact message to delete.
 * @param userId - ID of the authenticated user.
 * @param role - Role of the authenticated user.
 * @returns A promise that resolves when the message is deleted.
 */
export async function deleteAdminContactMessage(
    messageId: string,
    userId: string,
    role: UserRole,
) {
    const existingMessage = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
        select: {
            id: true,
            campingId: true,
        },
    });

    if (!existingMessage) {
        throw new NotFoundError("Contact message");
    }

    await assertCanManageCamping(userId, role, existingMessage.campingId);

    await prisma.contactMessage.delete({
        where: {
            id: messageId,
        },
    });
}
