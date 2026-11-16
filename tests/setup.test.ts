import { describe, test, expect } from "@jest/globals";

describe("Jest setup", () => {
  test("kan een eenvoudige berekening controleren", () => {
    const result = 2 + 2;

    expect(result).toBe(4);
  });
});