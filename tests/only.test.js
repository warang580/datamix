const { only } = require("../src/datamix");

describe("only", () => {
  it("returns a sub-object based on given keys", function () {
    expect(only({a: 1, b: 2, c: 3, d: 4}, ['a', 'd'])).toStrictEqual({a: 1, d: 4});
  });

  it("accepts dot notation in array format", function () {
    expect(only({a: {b: 2, c: 3}, d: 4}, ['a.b'])).toStrictEqual({a: {b: 2}});
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

  it("works on arrays too", function () {
    expect(only([{a: 1}, {b: 2}], ['0.a', '1.b']))
      .toStrictEqual({0: {a: 1}, 1: {b: 2}});
  });

  it("works on arrays with transformations too", function () {
    expect(only([{a: 1}, {b: 2}], {a: '0.a', b: '1.b'}))
      .toStrictEqual({a:1, b: 2});
  });
});
