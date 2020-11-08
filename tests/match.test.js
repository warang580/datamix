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

  it("handles wildcard paths", function () {
    let users = [{
      name: "Jane",
      contacts: [{email: "paul@mail.com"}],
    }, {
      name: "Fred",
      contacts: [{email: "john@mail.com"}, {email: "judy@mail.com"}],
    }];

    expect(match(users, {
      "*.contacts.*.email": emails => emails.indexOf('john@mail.com') !== -1,
    })).toStrictEqual(true);
  });

  it("coerces callback values into boolean", function () {
    expect(match(42, v => v)).toStrictEqual(true);
    expect(match([], v => v)).toStrictEqual(true);
    expect(match({}, v => v)).toStrictEqual(true);

    expect(match(0,         v => v)).toStrictEqual(false);
    expect(match(null,      v => v)).toStrictEqual(false);
    expect(match(undefined, v => v)).toStrictEqual(false);
  });
});
