import type { PrismaClient } from "@prisma/client";

export async function seedFaq(prisma: PrismaClient) {
    await prisma.faqItem.createMany({
        data: [
            {
                question: "Vanaf hoe laat kan ik inchecken?",
                answer: "Inchecken kan vanaf 14:00 uur.",
            },
            {
                question: "Tot hoe laat kan ik uitchecken?",
                answer: "Uitchecken kan tot 11:00 uur.",
            },
            {
                question: "Zijn honden toegestaan?",
                answer:
                    "Ja, honden zijn welkom op onze camping, mits aangelijnd.",
            },
            {
                question:
                    "Is er stroom op de kampeerplaatsen?",
                answer:
                    "Een deel van de kampeerplaatsen heeft stroom. Dit staat per plek aangegeven.",
            },
            {
                question:
                    "Kan ik mijn reservering wijzigen?",
                answer:
                    "Neem contact met ons op, dan kijken we samen naar de mogelijkheden.",
            },
        ],
    });
}