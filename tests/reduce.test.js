const { reduce } = require("../src/datamix");

describe("reduce", () => {
  it("behaves like Array.reduce on arrays", function () {
    expect(reduce([1, 2, 3], (s, v) => s + v, 1))
      .toStrictEqual(7);
  });

  it("behaves like Array.reduce on objects", function () {
    expect(reduce({a:1, b:2, c:3}, (s, v) => s + v, 1))
      .toStrictEqual(7);
  });

  it("ignores nil data", function () {
    expect(reduce(null, (s, v) => s + v, 1)).toStrictEqual(1);
    expect(reduce(undefined, (s, v) => s + v, 1)).toStrictEqual(1);
  });
});
