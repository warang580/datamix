const datamix = require("../src/datamix");

describe("values", () => {
  it("returns array values as-is", function () {
    expect(datamix.values(['a', 'b'])).toStrictEqual(['a', 'b']);
  });

  it("returns object values", function () {
    expect(datamix.values({a: 1, b: 2})).toStrictEqual([1, 2]);
  });

  it("returns empty array for nil values", function () {
    expect(datamix.values(undefined)).toStrictEqual([]);
  });
});
