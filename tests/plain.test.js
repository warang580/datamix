const { plain } = require("../src/datamix");

describe("plain", () => {
  it("returns empty objects as is", function () {
    expect(plain({})).toStrictEqual({});
  });

  it("returns an entry for empty objects", function () {
    expect(plain({o: {}})).toStrictEqual({o: {}});
  });

  it("returns an entry for empty arrays", function () {
    expect(plain({l: []})).toStrictEqual({l: []});
  });

  it("returns shallow object as is", function () {
    expect(plain({a: 1,  b: 2})).toStrictEqual({a: 1,  b: 2});
  });

  it("returns paths of deep objects", function () {
    expect(plain({
      a: {x: 1, y: 2},
      b: ['foo', "bar"],
      c: [{active: false}],
    })).toStrictEqual({
      'a.x': 1,
      'a.y': 2,
      'b': ['foo', "bar"],
      'c': [{active: false}],
    });
  });

  it("returns paths of deep objects by traversing arrays", function () {
    expect(plain({
      a: {x: 1, y: 2},
      b: 'foo',
      c: [{bar: 'baz'}],
    }, true)).toStrictEqual({
      'a.x': 1,
      'a.y': 2,
      'b': 'foo',
      'c.0.bar': 'baz',
    });
  });

  it("returns paths of arrays", function () {
    // NOTE: result === input in this case because there's
    // only one array that can't be traversed
    expect(plain({
      list: [
        {a: 1},
        {b: 2},
        {d: 4},
      ]
    }, false)).toStrictEqual({
      list: [
        {a: 1},
        {b: 2},
        {d: 4},
      ]
    });
  });

  it("returns paths of arrays by traversing arrays", function () {
    expect(plain({
      list: [
        {a: 1},
        {b: 2},
        {d: 4},
      ]
    }, true)).toStrictEqual({
      'list.0.a': 1,
      'list.1.b': 2,
      'list.2.d': 4,
    });
  });
});
