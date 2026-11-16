import { describe, test, expect } from "@jest/globals";
import { reservationSchema } from "../../src/schemas/reservationSchema.js";

describe("reservationSchema", () => {
    test("accepts a valid reservation", () => {
        // Arrange
        const reservation = {
            spotId: "spot-1",
            firstName: "Pascal",
            lastName: "Mol",
            email: "pascal@example.com",
            phone: "0612345678",
            guests: 2,
            arrivalDate: "2026-07-10",
            departureDate: "2026-07-13",
        };

        // Act
        const result = reservationSchema.safeParse(reservation);

        // Assert
        expect(result.success).toBe(true);
    });

    test("rejects a reservation when departure is before arrival", () => {
        // Arrange
        const reservation = {
            spotId: "spot-1",
            firstName: "Pascal",
            lastName: "Mol",
            email: "pascal@example.com",
            phone: "0612345678",
            guests: 2,
            arrivalDate: "2026-07-10",
            departureDate: "2026-07-09",
        };

        // Act
        const result = reservationSchema.safeParse(reservation);

        // Assert
        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        path: ["departureDate"],
                        message: "Departure date must be after arrival date",
                    }),
                ])
            );
        }
    });
});