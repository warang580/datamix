const datamix = require("../src/datamix");

describe("paths", () => {
  it("returns empty objects as an empty array", function () {
    expect(datamix.paths({})).toStrictEqual([]);
  });

  it("returns an entry for empty objects", function () {
    expect(datamix.paths({o: {}})).toStrictEqual(['o']);
  });

  it("returns an entry for empty arrays", function () {
    expect(datamix.paths({l: []})).toStrictEqual(['l']);
  });

  it("returns shallow object as is", function () {
    expect(datamix.paths({a: 1,  b: 2})).toStrictEqual(['a', 'b']);
  });

  it("returns paths of deep objects", function () {
    expect(datamix.paths({
      a: {x: 1, y: 2},
      b: ['foo', "bar"],
      c: [{active: false}],
    })).toStrictEqual(['a.x', 'a.y', 'b', 'c']);
  });

  it("returns paths of deep objects by traversing arrays", function () {
    expect(datamix.paths({
      a: {x: 1, y: 2},
      b: 'foo',
      c: [{bar: 'baz'}],
    }, true)).toStrictEqual(['a.x', 'a.y', 'b', 'c.0.bar']);
  });

  it("returns paths of arrays", function () {
    expect(datamix.paths({
      list: [
        {a: 1},
        {b: 2},
        {d: 4},
      ]
    }, false)).toStrictEqual(['list']);
  });

  it("returns paths of arrays by traversing arrays", function () {
    expect(datamix.paths({
      list: [
        {a: 1},
        {b: 2},
        {d: 4},
      ]
    }, true)).toStrictEqual(['list.0.a', 'list.1.b', 'list.2.d']);
  });
});
