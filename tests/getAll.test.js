const { getAll } = require("../src/datamix");

describe("getAll", () => {
  it("gets an empty array by default", function () {
    expect(
      getAll(undefined, "a.*.b")
    ).toStrictEqual([]);
  });

  it("creates an array of all values found at path with wildcard", function () {
    expect(
      getAll({list: [
        {a: 1}, {a: 2}, {b: 3}, {a: 4},
      ]}, "list.*.a")
    ).toStrictEqual([1, 2, 4]);
  });

  it("handles objects too", function () {
    expect(
      getAll({dict: {
        a: {id: 1},
        b: {id: 2},
        c: {id: 3},
        d: {id: 4},
      }}, "dict.*.id")
    ).toStrictEqual([1, 2, 3, 4]);
  });

  it("handles multiple wildcards", function () {
    expect(
      getAll([
        {name: "Jane", roles: [{name: 'admin'}, {name: 'supervisor'}]},
        {name: "John", roles: [{name: 'supervisor'}]},
        {name: "Fred", roles: [{name: 'user'}]},
      ], "*.roles.*.name")
    ).toStrictEqual(['admin', 'supervisor', 'supervisor', 'user']);
  });

  it('merges array together', function () {
    expect(
      getAll({list: [
        {a: [1, 2]}, {a: [3, 4, 5]}, {z: [6]}, {a: [7, 8]},
      ]}, 'list.*.a.*')
    ).toStrictEqual([1, 2, 3, 4, 5, 7, 8]);
  });

  it("can tell what path it took to find value", function () {
    expect(
      getAll({list: [
        {a: 1}, {a: 2}, {b: 3}, {a: 4},
      ]}, "list.*.a", true)
    ).toStrictEqual({
      'list.0.a': 1,
      'list.1.a': 2,
      'list.3.a': 4
    });
  });

  it('can find complex paths', function () {
    expect(
      getAll({list: [
        {a: [1, 2]}, {a: [3, 4, 5]}, {z: [6]}, {a: [7, 8]},
      ]}, 'list.*.a.*', true)
    ).toStrictEqual({
      'list.0.a.0': 1,
      'list.0.a.1': 2,
      'list.1.a.0': 3,
      'list.1.a.1': 4,
      'list.1.a.2': 5,
      'list.3.a.0': 7,
      'list.3.a.1': 8,
    });
  });

  // @TODO: default value other than empty array ?
});
