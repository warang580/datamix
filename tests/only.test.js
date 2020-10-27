const { only } = require("../src/datamix");

describe("only", () => {
  it("returns a sub-object based on given keys", function () {
    expect(only({a: 1, b: 2, c: 3, d: 4}, ['a', 'd'])).toStrictEqual({a: 1, d: 4});
  });

  it("returns a sub-object based on renamed keys", function () {
    expect(only({a: 1, b: 2, c: 3, d: 4}, {x: 'b', y: 'c'})).toStrictEqual({x: 2, y: 3});
  });

  it('handles complex transformations', function () {
    expect(only(
      {a: {x: 1, y: 2}, b: {z: 3}},
      {'foo.a': 'a.x', 'foo.b': 'b.z'}
    )).toStrictEqual({foo: {a: 1, b: 3}});
  });

  it("set undefined values if nothing is found", function () {
    expect(only({a: 1}, ['a', 'b'])).toStrictEqual({a: 1, b: undefined});
  });

  it("can ignore undefined values", function () {
    expect(only({a: 1}, ['a', 'b'], false)).toStrictEqual({a: 1});
  });
});
