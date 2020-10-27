const { map } = require("../src/datamix");

describe("map", () => {
  it("behaves like Array.map on arrays", function () {
    expect(map([1, 2, 3], v => v + 1))
      .toStrictEqual([2, 3, 4]);
  });

  it("behaves like Array.map on objects", function () {
    expect(map({a:1, b:2, c:3}, v => v + 1))
      .toStrictEqual({a:2, b:3, c:4});
  });

  it("ignores nil data", function () {
    expect(map(null,      v => v + 1)).toStrictEqual(null);
    expect(map(undefined, v => v + 1)).toStrictEqual(undefined);
  });
});
