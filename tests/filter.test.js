const datamix = require("../src/datamix");

describe("filter", () => {
  it("behaves like Array.filter on arrays", function () {
    expect(datamix.filter([1, 2, 3], v => v >= 2))
      .toStrictEqual([2, 3]);
  });

  it("behaves like Array.filter on objects", function () {
    expect(datamix.filter({a:1, b:2, c:3}, v => v >= 2))
      .toStrictEqual({b:2, c:3});
  });

  it("ignores nil data", function () {
    expect(datamix.filter(null,      v => v >= 2)).toStrictEqual(null);
    expect(datamix.filter(undefined, v => v >= 2)).toStrictEqual(undefined);
  });
});
