const datamix = require("../src/datamix");

describe("keys", () => {
  it("returns array indexes", function () {
    expect(datamix.keys(['a', 'b'])).toStrictEqual([0, 1]);
  });

  it("returns object keys", function () {
    expect(datamix.keys({a: 1, b: 2})).toStrictEqual(['a', 'b']);
  });

  it("returns empty array for nil keys", function () {
    expect(datamix.keys(undefined)).toStrictEqual([]);
  });
});
