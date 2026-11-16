import {
    describe,
    test,
    expect,
    jest,
    beforeEach,
} from "@jest/globals";

type MockFaq = {
    id: string;
    question: string;
    answer: string;
};

const findManyMock = jest.fn<
    (args: { orderBy: { question: "asc" } }) => Promise<MockFaq[]>
>();

const findUniqueMock = jest.fn<
    (args: unknown) => Promise<MockFaq | null>
>();

const createMock = jest.fn<
    (args: unknown) => Promise<MockFaq>
>();

const updateMock = jest.fn<
    (args: unknown) => Promise<MockFaq>
>();

jest.unstable_mockModule("../../src/prisma.js", () => ({
    prisma: {
        faqItem: {
            findMany: findManyMock,
            findUnique: findUniqueMock,
            create: createMock,
            update: updateMock,
        },
    },
}));

const { getAdminFaqs, getAdminFaqById, createAdminFaq, updateAdminFaq } = await import(
    "../../src/services/adminFaqService.js"
);

describe("adminFaqService", () => {
    const faqs = [
            {
                id: "faq-1",
                question: "Are pets allowed?",
                answer: "Yes, pets are allowed.",
            },
            {
                id: "faq-2",
                question: "Is electricity available?",
                answer: "Yes, electricity is available.",
            },
        ];

    beforeEach(() => {
        findManyMock.mockReset();
        findUniqueMock.mockReset();
        createMock.mockReset();
        updateMock.mockReset();
    });

    test("returns all FAQ items", async () => {
        // Arrange
        findManyMock.mockResolvedValue(faqs);

        // Act
        const result = await getAdminFaqs();

        // Assert
        expect(result).toEqual(faqs);

        expect(findManyMock).toHaveBeenCalledWith({
            orderBy: {
                question: "asc",
            },
        });
    });


    test("return a FAQ with an ID.", async () => {

        findUniqueMock.mockResolvedValue(faqs[0]);

        // Act
        const result = await getAdminFaqById("faq-1");

        // Assert
        expect(result).toEqual(faqs[0]);

        expect(findUniqueMock).toHaveBeenCalledWith({
            where: {
                id: "faq-1",
            },
        });
    });

    test("thows an error if the faq id doesn't exist", async () => {
        
        findUniqueMock.mockResolvedValue(null);

        // Assert
        await expect(getAdminFaqById("bad-id")).rejects.toThrow("Faq item");      
        
        expect(findUniqueMock).toHaveBeenCalledWith({
            where: { id: "bad-id"},
        });        
    });

    test("creates a new FAQ item", async () => {
        // Arrange
        const newFaq = {
            question: faqs[0].question,
            answer: faqs[0].answer,
        };

        createMock.mockResolvedValue(faqs[0]);

        // Act
        const result = await createAdminFaq(newFaq);

        // Assert
        expect(result).toEqual(faqs[0]);

        expect(createMock).toHaveBeenCalledWith({
            data: {
                question: newFaq.question,
                answer: newFaq.answer,
            },
        });
    });

    test("update an existing FAQ", async () => {
        //Arrange
        findUniqueMock.mockResolvedValue(faqs[0]);

        const updateData = {
            question: "Is electricity available?",
            answer: "Yes, electricity is available.",
        }

        const updatedFaq = {
            id: "faq-1",
            ...updateData,
        };

        updateMock.mockResolvedValue(updatedFaq);

        const result = await updateAdminFaq("faq-1", updateData);

        expect(result).toEqual(updatedFaq);

        expect(updateMock).toHaveBeenCalledWith({
            where: {
                id: "faq-1",
            },
            data: {
                question: "Is electricity available?",
                answer: "Yes, electricity is available.",
            },
        });
    })
})




