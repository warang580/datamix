const datamix = require("../src/datamix");
const sinon   = require("sinon");

describe("get", () => {
  it("returns data as-is if path is empty", function () {
    expect(datamix.get({foo: 'bar'}, [])).toStrictEqual({foo: 'bar'});
  });

  it("uses undefined as a default value", function () {
    expect(datamix.get({}, ['nothing'])).toBe(undefined);
  });

  it('can use another default value', function () {
    expect(datamix.get({}, ['not.found'], "default")).toBe("default");
  });

  it("gets value in a tree object", function () {
    expect(datamix.get({a: {b: {c: "d"}}}, ['a', 'b', 'c'])).toBe("d");
  });

  it("gets value in indexed array", function () {
    expect(datamix.get(["a", "b", "c"], ["1"])).toBe("b");
    expect(datamix.get(["a", "b", "c"], [2]))  .toBe("c");
  });

  it("can handle falsy values", function () {
    expect(datamix.get([false],     [0], 'default')).toBe(false);
    expect(datamix.get([0],         [0], 'default')).toBe(0);
    expect(datamix.get([undefined], [0], 'default')).toBe('default');
    expect(datamix.get([null],      [0], 'default')).toBe('default');
  });

  it("handles a string notation for path too", function () {
    expect(datamix.get({a: {b: {c: "d"}}}, 'a.b.c')).toBe("d");
  });

  it("can handle nil data as base value", function () {
    expect(datamix.get(null,      ['foo'], "bar")).toStrictEqual("bar");
    expect(datamix.get(undefined, ['foo'], "bar")).toStrictEqual("bar");
  });
});

describe("size", () => {
  it("returns array length", function () {
    expect(datamix.size(['a', 'b'])).toBe(2);
  });

  it("returns object length", function () {
    expect(datamix.size({foo: 'bar', baz: 'bee'})).toBe(2);
  });

  it("returns 0 for empty|nil data", function () {
    [[], {}, undefined, null].forEach(e => {
      expect(datamix.size(e)).toStrictEqual(0);
    })
  });

  it("returns undefined for simple data", function () {
    [42, 3.14, "hello"].forEach(e => {
      expect(datamix.size(e)).toStrictEqual(undefined);
    })
  });
});

describe("reduce", () => {
  it("behaves like Array.reduce on arrays", function () {
    expect(datamix.reduce([1, 2, 3], (s, v) => s + v, 1))
      .toStrictEqual(7);
  });

  it("behaves like Array.reduce on objects", function () {
    expect(datamix.reduce({a:1, b:2, c:3}, (s, v) => s + v, 1))
      .toStrictEqual(7);
  });

  it("ignores nil data", function () {
    expect(datamix.reduce(null, (s, v) => s + v, 1)).toStrictEqual(1);
    expect(datamix.reduce(undefined, (s, v) => s + v, 1)).toStrictEqual(1);
  });
});

describe("each", () => {
  it("behaves like Array.forEach on arrays", function () {
    let callback = sinon.fake();
    let array    = ["a", "b"];

    datamix.each(array, callback);

    expect(callback.calledWith("a", 0, array)).toBe(true);
    expect(callback.calledWith("b", 1, array)).toBe(true);
  });

  it("behaves like Array.forEach on objects", function () {
    let callback = sinon.fake();
    let object   = {a: 1, b: 2};

    datamix.each(object, callback);

    expect(callback.calledWith(1, "a", object)).toBe(true);
    expect(callback.calledWith(2, "b", object)).toBe(true);
  });

  it("ignores nil data", function () {
    let callback = sinon.fake();
    let object   = {a: 1, b: 2};

    datamix.each(null,      callback);
    datamix.each(undefined, callback);

    expect(callback.called).toBe(false);
  });
});

describe("eachSync", () => {
  it("behaves like Array.forEach on arrays with asynchronous callback", async function () {
    let calls = [];

    await datamix.eachSync([5, 10, 15], async (v, i, a) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, i, a]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([
      [5,  0, [5, 10, 15]],
      [10, 1, [5, 10, 15]],
      [15, 2, [5, 10, 15]]
    ]);
  });

  it("behaves like Array.forEach on objects with asynchronous callback", async function () {
    let calls = [];

    await datamix.eachSync({5: "foo", 10: "bar", 15: "baz"}, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([
      ["foo", "5",  {"5": "foo", "10": "bar", "15": "baz"}],
      ["bar", "10", {"5": "foo", "10": "bar", "15": "baz"}],
      ["baz", "15", {"5": "foo", "10": "bar", "15": "baz"}]
    ]);
  });

  it("ignores nil data", async function () {
    let calls = [];

    await datamix.eachSync(undefined, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    await datamix.eachSync(null, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([]);
  });
});

describe("map", () => {
  it("behaves like Array.map on arrays", function () {
    expect(datamix.map([1, 2, 3], v => v + 1))
      .toStrictEqual([2, 3, 4]);
  });

  it("behaves like Array.map on objects", function () {
    expect(datamix.map({a:1, b:2, c:3}, v => v + 1))
      .toStrictEqual({a:2, b:3, c:4});
  });

  it("ignores nil data", function () {
    expect(datamix.map(null,      v => v + 1)).toStrictEqual(null);
    expect(datamix.map(undefined, v => v + 1)).toStrictEqual(undefined);
  });
});

describe("filter", () => {
  it("behaves like Array.filter on arrays", function () {
    expect(datamix.filter([1, 2, 3], v => v >= 2))
      .toStrictEqual([2, 3]);
  });

  it("behaves like Array.filter on objects", function () {
    expect(datamix.filter({a:1, b:2, c:3}, v => v >= 2))
      .toStrictEqual({b:2, c:3});
  });

  it("ignores nil data", function () {
    expect(datamix.filter(null,      v => v >= 2)).toStrictEqual(null);
    expect(datamix.filter(undefined, v => v >= 2)).toStrictEqual(undefined);
  });
});

describe("set", () => {
  it("sets data in an empty object", function () {
    expect(datamix.set({}, ['a', 'b', 'c'], "d"))
      .toStrictEqual({a: {b: {c: "d"}}});
  });

  it("sets data in an existing array", function () {
    expect(datamix.set(["a", "b", "c", "d"], [2], "x"))
      .toStrictEqual(["a", "b", "x", "d"]);
  });

  it("udpates data in an existing object", function () {
    expect(datamix.set({a: {b: {c: "d"}}}, ['a', 'b', 'e'], "f"))
      .toStrictEqual({a: {b: {c: "d", e: "f"}}});
  });

  it("doesn't edit objects by side-effect", function () {
    let oldObject = {a: 1, b: 2, c: 3};
    let newObject = datamix.set(oldObject, 'd', 4);

    expect(oldObject).toStrictEqual({a: 1, b: 2, c: 3});
    expect(newObject).toStrictEqual({a: 1, b: 2, c: 3, d: 4});
  });

  it("updates data with a callback that takes the current value", function () {
    expect(datamix.set({count: 1}, ['count'], c => c + 1))
      .toStrictEqual({count: 2});
  });

  it("handles string notation", function () {
    expect(datamix.set({a: {b: {c: "d"}}}, 'a.b.e', "f"))
      .toStrictEqual({a: {b: {c: "d", e: "f"}}});
  });

  it("uses 'empty' base values as an object", function () {
    expect(datamix.set(null,      ['foo'], "bar")).toStrictEqual({foo: "bar"});
    expect(datamix.set(undefined, ['foo'], "bar")).toStrictEqual({foo: "bar"});
  });
});

describe("copy", () => {
  it("copies arrays", function () {
    let oldArray = [1, 2, 3];
    let newArray = datamix.copy(oldArray);

    newArray.push(4);

    expect(oldArray).toStrictEqual([1, 2, 3]);
    expect(newArray).toStrictEqual([1, 2, 3, 4]);
  });

  it("copies objects", function () {
    let oldObject = {a: 1, b: 2, c: 3};
    let newObject = datamix.copy(oldObject);

    newObject['d'] = 4;

    expect(oldObject).toStrictEqual({a: 1, b: 2, c: 3});
    expect(newObject).toStrictEqual({a: 1, b: 2, c: 3, d: 4});
  });

  it("return plain values as-is", function () {
    let values = [42, "hello", null, undefined];

    values.forEach(value => {
      expect(datamix.copy(value)).toStrictEqual(value);
    });
  });
});
