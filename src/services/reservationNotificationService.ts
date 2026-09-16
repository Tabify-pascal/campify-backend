import { prisma } from "../prisma.js";
import { sendMail } from "./mailService.js";

export async function sendReservationNotifications(
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

    const reservationDetails = [
        `Camping: ${camping.name}`,
        `Kampeerplaats: ${reservation.spot.name}`,
        `Naam: ${reservation.firstName} ${reservation.lastName}`,
        `Aantal gasten: ${reservation.guests}`,
        `Aankomst: ${reservation.arrivalDate.toLocaleDateString("nl-NL")}`,
        `Vertrek: ${reservation.departureDate.toLocaleDateString("nl-NL")}`,
        reservation.notes
            ? `Opmerking: ${reservation.notes}`
            : "",
    ]
        .filter(Boolean)
        .join("\n");

    const mailTasks: Promise<void>[] = [];

    if (managerEmails.length > 0) {
        mailTasks.push(
            sendMail({
                to: managerEmails,
                subject: `Nieuwe reservering voor ${camping.name}`,
                text: [
                    `Er is een nieuwe reservering gemaakt voor ${camping.name}.`,
                    "",
                    reservationDetails,
                    "",
                    `E-mail: ${reservation.email}`,
                    `Telefoon: ${reservation.phone}`,
                ].join("\n"),
            })
        );
    } else {
        console.warn(
            `No managers found for camping ${camping.id}`
        );
    }

    mailTasks.push(
        sendMail({
            to: reservation.email,
            subject: `Reservering ontvangen - ${camping.name}`,
            text: [
                `Hoi ${reservation.firstName},`,
                "",
                `Bedankt voor je reservering bij ${camping.name}.`,
                "We hebben je reservering ontvangen.",
                "",
                reservationDetails,
                "",
                "Je reservering staat momenteel op PENDING.",
                "Je ontvangt bericht zodra de reservering is bevestigd.",
                "",
                "Met vriendelijke groet,",
                camping.name,
            ].join("\n"),
        })
    );

    const results = await Promise.allSettled(mailTasks);

    results.forEach((result, index) => {
        if (result.status === "rejected") {
            console.error(
                "Failed to send reservation notification",
                {
                    reservationId,
                    mailIndex: index,
                    error: result.reason,
                }
            );
        }
    });
}