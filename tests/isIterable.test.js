const { isIterable } = require("../src/datamix");

describe("isIterable", () => {
  it("returns true for iterable data", function () {
    [[], {}].forEach(e => {
      expect(isIterable(e)).toStrictEqual(true);
    })
  });

  it("returns false for non-iterable data", function () {
    [42, 3.14, "hello", undefined, null].forEach(e => {
      expect(isIterable(e)).toStrictEqual(false);
    })
  });
});
