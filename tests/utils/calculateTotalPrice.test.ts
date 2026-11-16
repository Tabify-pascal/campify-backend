import { describe, test, expect } from "@jest/globals";
import { calculateTotalPrice } from "../../src/utils/calculateTotalPrice.js";

describe("calculateTotalPrice", () => {
    test("calculates the price for one night", () => {
        // Arrange
        const arrival = new Date("2026-07-01");
        const departure = new Date("2026-07-02");
        const pricePerNight = 25;

        // Act
        const result = calculateTotalPrice(
            arrival,
            departure,
            pricePerNight
        );

        // Assert
        expect(result).toBe(25);
    });

    test("calculates the price for three nights", () => {
        // Arrange
        const arrival = new Date("2026-07-10");
        const departure = new Date("2026-07-13");
        const pricePerNight = 35;

        // Act
        const result = calculateTotalPrice(
            arrival,
            departure,
            pricePerNight
        );

        // Assert
        expect(result).toBe(105);
    });

    test("throws an error when arrival and departure dates are equal", () => {
        // Arrange
        const arrival = new Date("2026-07-10");
        const departure = new Date("2026-07-10");
        const pricePerNight = 35;

        // Act & Assert
        expect(() => {
            calculateTotalPrice(arrival, departure, pricePerNight);
        }).toThrow("Departure date must be after arrival date");
    });

    test("throws an error when departure date is before the arrival date", () => {
        // Arrange
        const arrival = new Date("2026-07-15");
        const departure = new Date("2026-07-10");
        const pricePerNight = 35;

        // Act & Assert
        expect(() => {
            calculateTotalPrice(arrival, departure, pricePerNight);
        }).toThrow("Departure date must be after arrival date");
    });
});