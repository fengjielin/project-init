const sum = require("../src/utils/sum");

describe("jest case", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
