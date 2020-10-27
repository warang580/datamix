const { size } = require("../src/datamix");

describe("size", () => {
  it("returns array length", function () {
    expect(size(['a', 'b'])).toBe(2);
  });

  it("returns object length", function () {
    expect(size({foo: 'bar', baz: 'bee'})).toBe(2);
  });

  it("returns 0 for empty iterables", function () {
    [[], {}].forEach(e => {
      expect(size(e)).toStrictEqual(0);
    })
  });

  it("returns undefined for simple data and nil", function () {
    [42, 3.14, "hello", undefined, null].forEach(e => {
      expect(size(e)).toStrictEqual(undefined);
    })
  });
});
