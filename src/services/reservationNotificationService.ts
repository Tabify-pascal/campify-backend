import { prisma } from "../prisma.js";
import { sendMail } from "./mailService.js";

export async function sendReservationManagerNotification(
    reservationId: string
): Promise<void> {
    const reservation = await prisma.reservation.findUnique({
        where: {
            id: reservationId,
        },
        include: {
            spot: {
                include: {
                    camping: {
                        include: {
                            managers: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!reservation) {
        return;
    }

    const camping = reservation.spot.camping;

    const managerEmails = camping.managers.map(
        (manager) => manager.user.email
    );

    if (managerEmails.length === 0) {
        console.warn(
            `No managers found for camping ${camping.id}`
        );

        return;
    }

    await sendMail({
        to: managerEmails,
        subject: `Nieuwe reservering voor ${camping.name}`,
        text: [
            `Er is een nieuwe reservering gemaakt voor ${camping.name}.`,
            "",
            `Kampeerplaats: ${reservation.spot.name}`,
            `Naam: ${reservation.firstName} ${reservation.lastName}`,
            `E-mail: ${reservation.email}`,
            `Telefoon: ${reservation.phone}`,
            `Aantal gasten: ${reservation.guests}`,
            `Aankomst: ${reservation.arrivalDate.toLocaleDateString("nl-NL")}`,
            `Vertrek: ${reservation.departureDate.toLocaleDateString("nl-NL")}`,
            reservation.notes
                ? `Opmerking: ${reservation.notes}`
                : "",
        ]
            .filter(Boolean)
            .join("\n"),
    });
}