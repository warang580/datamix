const { keys } = require("../src/datamix");

describe("keys", () => {
  it("returns array indexes", function () {
    expect(keys(['a', 'b'])).toStrictEqual([0, 1]);
  });

  it("returns object keys", function () {
    expect(keys({a: 1, b: 2})).toStrictEqual(['a', 'b']);
  });

  it("returns empty array for nil keys", function () {
    expect(keys(undefined)).toStrictEqual([]);
  });
});
