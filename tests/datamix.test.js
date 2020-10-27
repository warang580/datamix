const datamix = require("../src/datamix");
const sinon   = require("sinon");

describe("get", () => {
  it("returns data as-is if path is 'empty'", function () {
    expect(datamix.get({foo: 'bar'}, [])).toStrictEqual({foo: 'bar'});
    expect(datamix.get({foo: 'bar'}, '')).toStrictEqual({foo: 'bar'});
    expect(datamix.get({foo: 'bar'}, null)).toStrictEqual({foo: 'bar'});
    expect(datamix.get({foo: 'bar'}, undefined)).toStrictEqual({foo: 'bar'});
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
    expect(datamix.get(["a", "b", "c", "d"], "0"))  .toBe("a");
    expect(datamix.get(["a", "b", "c", "d"], ["1"])).toBe("b");
    expect(datamix.get(["a", "b", "c", "d"], [2]))  .toBe("c");
    expect(datamix.get(["a", "b", "c", "d"], 3))    .toBe("d");
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

  it("returns 0 for empty iterables", function () {
    [[], {}].forEach(e => {
      expect(datamix.size(e)).toStrictEqual(0);
    })
  });

  it("returns undefined for simple data and nil", function () {
    [42, 3.14, "hello", undefined, null].forEach(e => {
      expect(datamix.size(e)).toStrictEqual(undefined);
    })
  });
});

describe("isIterable", () => {
  it("returns true for iterable data", function () {
    [[], {}].forEach(e => {
      expect(datamix.isIterable(e)).toStrictEqual(true);
    })
  });

  it("returns false for non-iterable data", function () {
    [42, 3.14, "hello", undefined, null].forEach(e => {
      expect(datamix.isIterable(e)).toStrictEqual(false);
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

    expect(datamix.set(["a", "b", "c", "d"], '2', "x"))
      .toStrictEqual(["a", "b", "x", "d"]);

    expect(datamix.set(["a", "b", "c", "d"], 2, "x"))
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

describe("setAll", () => {
  it("sets data in all paths", function () {
    expect(datamix.setAll([
      {id: 1, active: false}, {id: 2, active: true}, {id: 3, active: false}
    ], '*.active', true)).toStrictEqual([
      {id: 1, active: true}, {id: 2, active: true}, {id: 3, active: true}
    ]);
  });

  it("can use callback to set value", function () {
    expect(datamix.setAll([
      {id: 1, active: false}, {id: 2, active: true}, {id: 3, active: false}
    ], '*.active', a => ! a)).toStrictEqual([
      {id: 1, active: true}, {id: 2, active: false}, {id: 3, active: true}
    ]);
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

describe("parseJson", () => {
  it("parses a valid json string", function () {
    expect(datamix.parseJson(JSON.stringify({a: 1, b: 2}))).toStrictEqual({a: 1, b: 2});
  });

  it("defaults to empty object if json is invalid", function () {
    expect(datamix.parseJson("{invalid}")).toStrictEqual({});
  });

  it("uses defaultValue if json is invalid", function () {
    expect(datamix.parseJson("{invalid}", 42)).toStrictEqual(42);
  });
});

describe("_get", () => {
  it("returns a functional version of get", function () {
    let users = [{
      name: "Jane",
    }, {
      name: "Fred",
    }, {
      // unnamed
    }];

    expect(datamix.map(users, datamix._get('name', 'unnamed'))).toStrictEqual(["Jane", "Fred", "unnamed"]);
  });
});

describe("_set", () => {
  it("returns a functional version of set", function () {
    let users = [{
      connections: 1,
    }, {
      connections: 2,
    }, {
      // never connected
    }];

    expect(
      datamix
        .map(users, datamix._set('connections', c => (c||0) + 1))
        .map(datamix._get('connections', 0))
    ).toStrictEqual([2, 3, 1]);
  });
});

describe("only", () => {
  it("returns a sub-object based on given keys", function () {
    expect(datamix.only({a: 1, b: 2, c: 3, d: 4}, ['a', 'd'])).toStrictEqual({a: 1, d: 4});
  });

  it("returns a sub-object based on renamed keys", function () {
    expect(datamix.only({a: 1, b: 2, c: 3, d: 4}, {x: 'b', y: 'c'})).toStrictEqual({x: 2, y: 3});
  });

  it('handles complex transformations', function () {
    expect(datamix.only(
      {a: {x: 1, y: 2}, b: {z: 3}},
      {'foo.a': 'a.x', 'foo.b': 'b.z'}
    )).toStrictEqual({foo: {a: 1, b: 3}});
  });

  it("set undefined values if nothing is found", function () {
    expect(datamix.only({a: 1}, ['a', 'b'])).toStrictEqual({a: 1, b: undefined});
  });

  it("can ignore undefined values", function () {
    expect(datamix.only({a: 1}, ['a', 'b'], false)).toStrictEqual({a: 1});
  });
});

describe("_only", () => {
  it("returns a functional version of only", function () {
    let users = [{
      name: "Jane",
      contact: {
        email: "jane@mail.com",
      },
      address: {
        city: {
          name: "Paris",
          zipcode: "75000",
        },
      },
    }, {
      name: "Fred",
      contact: {
        email: "fred@mail.com",
      },
      address: {
        city: {
          name: "Strasbourg",
          zipcode: "67000",
        },
      },
    }];

    expect(datamix.map(users, datamix._only({
      name:  'name',
      email: 'contact.email',
      city:  'address.city.name',
    }))).toStrictEqual([
      {name: "Jane", email: "jane@mail.com", city: "Paris"},
      {name: "Fred", email: "fred@mail.com", city: "Strasbourg"},
    ]);
  });
});

describe("getFirst", () => {
  it("gets the first defined value", function () {
    let user = {
      name: "Jane",
      work_phone: "0456",
      home_phone: "0123",
    };

    expect(
      datamix.getFirst(user, ['mobile_phone', 'home_phone', 'work_phone'], '?')
    ).toStrictEqual("0123");
  });

  it("defaults to defaultValue if nothing is found", function () {
    expect(
      datamix.getFirst({}, ['mobile_phone', 'home_phone', 'work_phone'], '?')
    ).toStrictEqual("?");
  });
});

describe("_getFirst", () => {
  it("returns a functional version of getFirst", function () {
    let data = [
      {a: 1, b: 2},
      {b: 2},
      {c: 3},
    ];

    expect(
      datamix.map(data, datamix._getFirst(['a', 'b'], 0))
    ).toStrictEqual([1, 2, 0]);
  });
});

describe("getAll", () => {
  it("gets an empty array by default", function () {
    expect(
      datamix.getAll(undefined, "a.*.b")
    ).toStrictEqual([]);
  });

  it("creates an array of all values found at path with wildcard", function () {
    expect(
      datamix.getAll({list: [
        {a: 1}, {a: 2}, {b: 3}, {a: 4},
      ]}, "list.*.a")
    ).toStrictEqual([1, 2, 4]);
  });

  it("handles objects too", function () {
    expect(
      datamix.getAll({dict: {
        a: {id: 1},
        b: {id: 2},
        c: {id: 3},
        d: {id: 4},
      }}, "dict.*.id")
    ).toStrictEqual([1, 2, 3, 4]);
  });

  it("handles multiple wildcards", function () {
    expect(
      datamix.getAll([
        {name: "Jane", roles: [{name: 'admin'}, {name: 'supervisor'}]},
        {name: "John", roles: [{name: 'supervisor'}]},
        {name: "Fred", roles: [{name: 'user'}]},
      ], "*.roles.*.name")
    ).toStrictEqual(['admin', 'supervisor', 'supervisor', 'user']);
  });

  it('merges array together', function () {
    expect(
      datamix.getAll({list: [
        {a: [1, 2]}, {a: [3, 4, 5]}, {z: [6]}, {a: [7, 8]},
      ]}, 'list.*.a.*')
    ).toStrictEqual([1, 2, 3, 4, 5, 7, 8]);
  });

  it("can tell what path it took to find value", function () {
    expect(
      datamix.getAll({list: [
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
      datamix.getAll({list: [
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

describe("_getAll", () => {
  it("returns a functional version of getAll", function () {
    let users = [{
      name: "Jane",
      contacts: [{
        email: "jane@mail.com",
      }, {
        email: "john@mail.com",
      }],
    }, {
      name: "Fred",
      contacts: [{
        email: "fred@mail.com",
      }, {
        email: "judy@mail.com",
      }],
    }];

    expect(
      datamix.map(users, datamix._getAll("contacts.*.email"))
    ).toStrictEqual([["jane@mail.com", "john@mail.com"], ["fred@mail.com", "judy@mail.com"]]);
  });
});

describe("defaultsTo", () => {
  it("returns value itself if non-nil", function () {
    expect(datamix.defaultsTo(['a', 'b'])).toStrictEqual(['a', 'b']);
  });

  it("returns array by default if value is nil", function () {
    expect(datamix.defaultsTo(undefined)).toStrictEqual([]);
  });

  it("returns defaultValue when set if value is nil", function () {
    expect(datamix.defaultsTo(undefined, {})).toStrictEqual({});
  });
});

describe("keys", () => {
  it("returns array indexes", function () {
    expect(datamix.keys(['a', 'b'])).toStrictEqual([0, 1]);
  });

  it("returns object keys", function () {
    expect(datamix.keys({a: 1, b: 2})).toStrictEqual(['a', 'b']);
  });

  it("returns empty array for nil keys", function () {
    expect(datamix.keys(undefined)).toStrictEqual([]);
  });
});

describe("values", () => {
  it("returns array values as-is", function () {
    expect(datamix.values(['a', 'b'])).toStrictEqual(['a', 'b']);
  });

  it("returns object values", function () {
    expect(datamix.values({a: 1, b: 2})).toStrictEqual([1, 2]);
  });

  it("returns empty array for nil values", function () {
    expect(datamix.values(undefined)).toStrictEqual([]);
  });
});

describe("plain", () => {
  it("returns empty objects as is", function () {
    expect(datamix.plain({})).toStrictEqual({});
  });

  it("returns an entry for empty objects", function () {
    expect(datamix.plain({o: {}})).toStrictEqual({o: {}});
  });

  it("returns an entry for empty arrays", function () {
    expect(datamix.plain({l: []})).toStrictEqual({l: []});
  });

  it("returns shallow object as is", function () {
    expect(datamix.plain({a: 1,  b: 2})).toStrictEqual({a: 1,  b: 2});
  });

  it("returns paths of deep objects", function () {
    expect(datamix.plain({
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
    expect(datamix.plain({
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
    expect(datamix.plain({
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
    expect(datamix.plain({
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

describe("entries", () => {
  it("returns an empty array with empty objects", function () {
    expect(datamix.entries({})).toStrictEqual([]);
  });

  let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

  it("returns shallow entries by default", function () {
    expect(datamix.entries(data)).toStrictEqual([
      ['a', 1],
      ['b', {x: 2, y: [3, 4]}],
      ['c', ['foo', 'bar']],
    ]);
  });

  it("returns deep entries", function () {
    expect(datamix.entries(data, true)).toStrictEqual([
      ['a', 1],
      ['b.x', 2],
      ['b.y', [3, 4]],
      ['c', ['foo', 'bar']],
    ]);
  });

  it("returns deep entries by traversing arrays", function () {
    expect(datamix.entries(data, true, true)).toStrictEqual([
      ['a', 1],
      ['b.x', 2],
      ['b.y.0', 3],
      ['b.y.1', 4],
      ['c.0', 'foo'],
      ['c.1', 'bar']
    ]);
  });
});
