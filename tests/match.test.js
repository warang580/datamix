const { match, tap } = require("../src/datamix");

describe("match", () => {
  it("uses strict equality with values as predicates", function () {
    expect(match(42, 42))      .toStrictEqual(true);
    expect(match(true, true))  .toStrictEqual(true);
    expect(match(true, "true")).toStrictEqual(false);
  });

  it("uses callback predicates", function () {
    expect(match(true,   v => !! v)).toStrictEqual(true);
    expect(match("true", v => !! v)).toStrictEqual(true);
  });

  it("handles path predicates", function () {
    expect(match({a: {x: 1, y: 2}, b: 3}, {'a.x': 1, b: 3}))    .toStrictEqual(true);
    expect(match({a: {x: 1, y: 2}, b: 3}, {'a.x': 1, 'a.y': 3})).toStrictEqual(false);
  });

  it("handles entries predicates", function () {
    expect(match({a: {x: 1, y: 2}, b: 3}, [['a.x', 1], ['b', 3]]))
      .toStrictEqual(true);

    expect(match({a: {x: 1, y: 2}, b: 3}, [['a.x', 1], ['a.y',  3]]))
      .toStrictEqual(false);
  });

  it("handles entries + callback predicates", function () {
    expect(match({a: {x: 1, y: 2}, b: 3}, [['a.x', v => v < 2]]))
      .toStrictEqual(true);

    expect(match({a: {x: 1, y: 2}, b: 3}, [['a.x', v => v > 2]]))
      .toStrictEqual(false);
  });

  it("handles objects + callback predicates", function () {
    expect(match({a: {x: 1, y: 2}, b: 3}, {'a.x': v => v < 2}))
      .toStrictEqual(true);

    expect(match({a: {x: 1, y: 2}, b: 3}, {'a.x': v => v > 2}))
      .toStrictEqual(false);
  });

  // @TODO: wildcard paths ?
});
