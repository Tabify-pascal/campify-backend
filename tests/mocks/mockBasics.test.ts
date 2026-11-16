import { describe, test, expect, jest } from "@jest/globals";

describe("Mock basics", () => {
    test("returns a mocked price", () => {
        // Arrange
        const getPrice = jest.fn().mockReturnValue(35);

        // Act
        const result = getPrice();

        // Assert
        expect(result).toBe(35);
        expect(getPrice).toHaveBeenCalledTimes(1);
    });
});