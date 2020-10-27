const datamix = require("../src/datamix");

describe("map", () => {
  it("behaves like Array.map on arrays", function () {
    expect(datamix.map([1, 2, 3], v => v + 1))
      .toStrictEqual([2, 3, 4]);
  });

  it("behaves like Array.map on objects", function () {
    expect(datamix.map({a:1, b:2, c:3}, v => v + 1))
      .toStrictEqual({a:2, b:3, c:4});
  });

  it("ignores nil data", function () {
    expect(datamix.map(null,      v => v + 1)).toStrictEqual(null);
    expect(datamix.map(undefined, v => v + 1)).toStrictEqual(undefined);
  });
});
