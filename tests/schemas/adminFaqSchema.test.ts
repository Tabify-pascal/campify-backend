import { describe, test, expect} from "@jest/globals";
import { adminFaqSchema } from "../../src/schemas/adminFaqSchema";

describe("adminFaqSchema", () => {
    test("accepts a valid FAQ", () => {
        // Arrange
        const faq = {
            question: "Are pets allowed?",
            answer: "Yes, pets are allowed.",
        };

        // Act
        const result = adminFaqSchema.safeParse(faq);

        // Assert
        expect(result.success).toBe(true);
    });

    test("rejects an invalid FAQ", () => {
        // Arrange 
        const faq = {
            question: "",
            answer: "Yes, pets are allowed.",
        };

        // Act
        const result = adminFaqSchema.safeParse(faq);

        // Assert
        expect(result.success).toBe(false);
    });

    test("rejects an FAQ if a value would be empty when trimmed", () => {
        // Arrange 
        const faq = {
            question: "     ",
            answer: "Yes, pets are allowed.",
        };

        // Act
        const result = adminFaqSchema.safeParse(faq);

        // Assert
        expect(result.success).toBe(false);
    });

    test("trims whitespace from valid FAQ values", () => {
        // Arrange
        const faq = {
            question: "  Are pets allowed?  ",
            answer: "  Yes, pets are allowed.  ",
        };

        // Act
        const result = adminFaqSchema.safeParse(faq);

        // Assert
        expect(result.success).toBe(true);

        // Controleer hier de getrimde question en answer
        if (!result.success) {
            throw new Error("Expected FAQ to be valid");
        }

        expect(result.data).toEqual({
            question: "Are pets allowed?",
            answer: "Yes, pets are allowed."
        });
    });
});