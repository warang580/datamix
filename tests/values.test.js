const { values } = require("../src/datamix");

describe("values", () => {
  it("returns array values as-is", function () {
    expect(values(['a', 'b'])).toStrictEqual(['a', 'b']);
  });

  it("returns object values", function () {
    expect(values({a: 1, b: 2})).toStrictEqual([1, 2]);
  });

  it("returns empty array for nil values", function () {
    expect(values(undefined)).toStrictEqual([]);
  });
});
