const { entries } = require("../src/datamix");

describe("entries", () => {
  it("returns an empty array with empty objects", function () {
    expect(entries({})).toStrictEqual([]);
  });

  let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

  it("returns shallow entries by default", function () {
    expect(entries(data)).toStrictEqual([
      ['a', 1],
      ['b', {x: 2, y: [3, 4]}],
      ['c', ['foo', 'bar']],
    ]);
  });

  it("returns deep entries", function () {
    expect(entries(data, true)).toStrictEqual([
      ['a', 1],
      ['b.x', 2],
      ['b.y', [3, 4]],
      ['c', ['foo', 'bar']],
    ]);
  });

  it("returns deep entries by traversing arrays", function () {
    expect(entries(data, true, true)).toStrictEqual([
      ['a', 1],
      ['b.x', 2],
      ['b.y.0', 3],
      ['b.y.1', 4],
      ['c.0', 'foo'],
      ['c.1', 'bar']
    ]);
  });
});
