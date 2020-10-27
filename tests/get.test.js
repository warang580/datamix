const { get } = require("../src/datamix");

describe("get", () => {
  it("returns data as-is if path is 'empty'", function () {
    expect(get({foo: 'bar'}, [])).toStrictEqual({foo: 'bar'});
    expect(get({foo: 'bar'}, '')).toStrictEqual({foo: 'bar'});
    expect(get({foo: 'bar'}, null)).toStrictEqual({foo: 'bar'});
    expect(get({foo: 'bar'}, undefined)).toStrictEqual({foo: 'bar'});
  });

  it("uses undefined as a default value", function () {
    expect(get({}, ['nothing'])).toBe(undefined);
  });

  it('can use another default value', function () {
    expect(get({}, ['not.found'], "default")).toBe("default");
  });

  it("gets value in a tree object", function () {
    expect(get({a: {b: {c: "d"}}}, ['a', 'b', 'c'])).toBe("d");
  });

  it("gets value in indexed array", function () {
    expect(get(["a", "b", "c", "d"], "0"))  .toBe("a");
    expect(get(["a", "b", "c", "d"], ["1"])).toBe("b");
    expect(get(["a", "b", "c", "d"], [2]))  .toBe("c");
    expect(get(["a", "b", "c", "d"], 3))    .toBe("d");
  });

  it("can handle falsy values", function () {
    expect(get([false],     [0], 'default')).toBe(false);
    expect(get([0],         [0], 'default')).toBe(0);
    expect(get([undefined], [0], 'default')).toBe('default');
    expect(get([null],      [0], 'default')).toBe('default');
  });

  it("handles a string notation for path too", function () {
    expect(get({a: {b: {c: "d"}}}, 'a.b.c')).toBe("d");
  });

  it("can handle nil data as base value", function () {
    expect(get(null,      ['foo'], "bar")).toStrictEqual("bar");
    expect(get(undefined, ['foo'], "bar")).toStrictEqual("bar");
  });
});
