const { setWith } = require("../src/datamix");

describe.only("setWith", () => {
  it("sets data using {path: value, ...} object", function () {
    expect(setWith({a: 1, b: 2, c: [3, 4]}, {'a': -1, 'c.0': 0}))
      .toStrictEqual({a: -1, b: 2, c: [0, 4]});
  });

  it("sets data using [[path, value], ...] array", function () {
    expect(setWith({a: 1, b: 2, c: [3, 4]}, [['a', -1], ['c.0', 0]]))
      .toStrictEqual({a: -1, b: 2, c: [0, 4]});
  });
});
