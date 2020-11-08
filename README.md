# Datamix [![GitHub release](https://img.shields.io/github/release/warang580/datamix.svg)](https://gitHub.com/warang580/datamix/releases/)

[![Build Status](https://travis-ci.org/warang580/datamix.svg?branch=develop)](https://travis-ci.org/warang580/datamix)
[![Dependencies](https://david-dm.org/warang580/datamix.svg)](https://david-dm.org/warang580/datamix)
[![DevDependencies](https://david-dm.org/warang580/datamix/dev-status.svg)](https://david-dm.org/warang580/datamix#info=devDependencies)
[![Downloads](https://img.shields.io/npm/dt/@warang580/datamix)](https://npmjs.org/package/@warang580/datamix)

Manipulate data of different types with the same consistent API to fetch or update important data.
(ie. objects and arrays are both key-value pairs)

Inspired by Clojure sequences.

> Clojure defines many algorithms in terms of sequences (seqs). A seq is a **logical list**, and unlike most [languages] where the list is represented by a concrete [...] structure, Clojure uses the ISeq interface to allow **many data structures to provide access to their elements as sequences**. ([source](https://clojure.org/reference/sequences))

# Getting Started

## Installation

[![NpmInstall](https://img.shields.io/badge/npm-install%20%40warang580%2Fdatamix-blue)](https://npmjs.org/package/@warang580/datamix)

[![YarnInstall](https://img.shields.io/badge/yarn-add%20%40warang580%2Fdatamix-blue)](https://classic.yarnpkg.com/en/package/@warang580/datamix)

## Import

```js
// ES6
import mix from "@warang580/datamix";
// NodeJS
const mix = require("@warang580/datamix");
```

You can also import specific functions with object notation, like :

```js
import { get, set } from "@warang580/datamix";
```

## API

This section contains all functions with a quick description and usage example.
You can click on the function signature to check associated tests as more examples.

Reminder: all functions work on arrays AND objects.

### [`get(data, path, notFoundValue = undefined)`](/tests/get.test.js)

Get a value in a deep data tree of values.

```js
let userId   = get(response, 'data.user.id'); // => <someId> or `undefined`
// OR (array notation)
let userName = get(users, [userId, 'name'], "unknown"); // => <name> or "unknown"
```

### [`set(data, path, newValue)`](/tests/set.test.js)

Set a value (without side-effects) in a deep data tree of values.

```js
let user = {
  firstname: "John",
  lastname:  "Doe",
  auth: {
    login: "jdoe@email.com",
    connections: 12,
  }
};

user = set(user, 'age', 50);
user = set(user, 'auth.connections', c => c + 1);

user /* => {
  firstname: "John",
  lastname:  "Doe",
  age:       50,
  auth: {
    login: "jdoe@email.com",
    connections: 13,
  }
} */
```

### [`defaultsTo(data, defaultValue = [])`](/tests/defaultsTo.test.js)

Coerce a nil value (`undefined` or `null`) into another. Used to ensure that a value is always an array or object depending on needs.

```js
let config = defaultsTo(getConfig(/* ... */), {})
```

### [`only(data, paths, withMissing = true)`](/tests/only.test.js)

Get a subset of data using paths. Paths can be arrays ['path', ...] or objects like `{newpath: oldpath, ...}`.

```js
only({x:1, y:2}, ['x']) // =>  {x: 1}
only({a:0}, {foo: 'a'}) // =>  {foo: 0}
only({}, ['a'])         // =>  {a: undefined}
only({}, ['a'], false)  // =>  {}

only(
  {a: {x: 1, y: 2}, b: {z: 3}},
  {'foo.a': 'a.x', 'foo.b': 'b.z'}
) // => {foo: {a: 1, b: 3}}
```

### [`keys(data)`](/tests/keys.test.js)

Get all data keys, like Object.keys().

```js
keys({a: 1, b, 2, c: {x: 3, y: 4}}) // ['a', 'b', 'c']
```

### [`values(data)`](/tests/values.test.js)

Get all data values, like Object.values().

```js
values({a: 1, b, 2, c: {x: 3, y: 4}}) // => [1, 2, {x: 3, y: 4}]
```

### [`size(data)`](/tests/size.test.js)

Get data size, like Array.length.

```js
size({a: 1, b, 2, c: {x: 3, y: 4}}) // => 3
size(undefined) // => undefined
```

### [`getFirst(data, paths, defaultValue = undefined)`](/tests/getFirst.test.js)

Get the first non-nil value using a list of possible paths in a value.

```js
let user = {
  work_phone: "0456",
  home_phone: "0123",
};

let number = getFirst(user, ['mobile_phone', 'home_phone', 'work_phone'], "?"); // => "0123"
```

### [`getAll(data, wildcardPath, withPaths = false)`](/tests/getAll.test.js)

Aggregate all values that match a specific path with wildcards.

```js
let users = [{
  name: "Jane",
  contacts: [{email: "paul@mail.com"}],
}, {
  name: "Fred",
  contacts: [{email: "john@mail.com"}, {email: "judy@mail.com"}],
}];

// Only get values
getAll(users, "*.contacts.*.email") // => ["paul@mail.com", "john@mail.com", "judy@mail.com"]

// Get paths and values (can be useful to "set" or "setWith" later)
getAll({list: [
  {a: [1, 2]}, {z: [3]}, {a: [4, 5]},
]}, 'list.*.a.*', true) /* => {
  'list.0.a.0': 1,
  'list.0.a.1': 2,
  'list.2.a.0': 4,
  'list.2.a.1': 5,
} */
```

### [`setAll(data, wildcardPath, newValue)`](/tests/setAll.test.js)

Set all values that matches path with a new value.

```js
setAll(game, "players.*.isDead", false)
setAll(game, "players.*.score",  s => (s || 0) + 1)
```

### [`setWith(data, pathValuePairs)`](/tests/setWith.test.js)

Set all values in data using path-value pairs.

```js
setWith({a: 1, b: 2, c: [3, 4]}, {'a': -1, 'c.0': 0})     // => {a: -1, b: 2, c: [0, 4]}
setWith({a: 1, b: 2, c: [3, 4]}, [['a', -1], ['c.0', 0]]) // => {a: -1, b: 2, c: [0, 4]}
```


### [`paths(data, traverseArrays = false)`](/tests/paths.test.js)

Get an array of all available paths in data.

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

paths(data)       // => ['a', 'b.x', 'b.y', 'c'],
paths(data, true) // => ['a', 'b.x', 'b.y.0', 'b.y.1', 'c.0', 'c.1'],

let list = [1, {a: 1, b: [3, 4]}, [5, 6]];

paths(list)       // => ['0', '1.a', '1.b', '2']
paths(list, true) // => ['0', '1.a', '1.b.0', '1.b.1', '2.0', '2.1']
```

### [`entries(data, deep = false, traverseArrays = false)`](/tests/entries.test.js)

Get an array of all [path, value] in data, like `Object.entries()`.

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

entries(data)             // => [['a', 1], ['b', {x: 2, y: [3,4]}], ['c', ['foo', 'bar']]]
entries(data, true)       // => [['a', 1], ['b.x', 2], ['b.y', [3, 4]], ['c', ['foo', 'bar']]]
entries(data, true, true) // => [['a', 1], ['b.x', 2], ['b.y.0', 3], ['b.y.1', 4], ['c.0', 'foo'], ['c.1', 'bar']]
```

### [`plain(data, traverseArrays = false)`](/tests/plain.test.js)

Get an object of all {path: value} in data.

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

paths(data)       // => {'a': 1, 'b.x': 2, 'b.y': [3, 4], 'c': ['foo', 'bar']}
paths(data, true) // => {'a': 1, 'b.x': 2, 'b.y.0': 3, 'b.y.1': 4, 'c.0': 'foo', 'c.1': 'bar'}
```

### [`isIterable(data)`](/tests/isIterable.test.js)

Returns if data can be iterated upon using functions of this library.

```js
isIterable([/* ... */]) // => true
isIterable({/* ... */}) // => true
isIterable(undefined)   // => false
isIterable(null)        // => false
isIterable("hello")     // => false
isIterable(42)          // => false
```

### [`map(data, (v, k, data) => {...})`](/tests/map.test.js)

Update value on key-value pairs (reminder: all functions work on objects too).

```js
let names = map(users, user => get(user, 'name', 'unknown'));
```

### [`filter(data, (v, k, data) => {...})`](/tests/filter.test.js)

Recreate a new data based on key-value filter.

```js
let admins = filter(users, user => get(user, 'is_admin', false));
```

### [`reduce(data, (acc, v, k, data) => {...})`](/tests/reduce.test.js)

Reduce data based on key-value pairs.

```js
let shoppingList = {
  "egg":       {count: 6, unitPrice: 1},
  "chocolate": {count: 2, unitPrice: 10},
};

let total = reduce(
  shoppingList,
  (total, ingredient) => total + get(ingredient,  'count', 0) * get(ingredient,  'price', 0),
  0
); // => 26
```

### [`each(data, (v, k, data) => {...})`](/tests/each.test.js)

Iterate on key-value pairs to do side-effects.

```js
each(dictionary, word => console.log("word", word));
```

### [`eachSync(data, async (v, k, data) => {...})`](/tests/eachSync.test.js)

Iterate on key-value pairs to do asynchronous side-effects, but synchronously and in order (avoids boilerplate).

```js
await eachSync(users, saveUserPromise);
// All promises are done here (in order)
```

### [`eachAsync(data, async (v, k, data) => {...})`](/tests/eachSync.test.js)

Like `eachSync` but we don't ensure order, similar as `Promise.all()`.

```js
await eachAsync(users, saveUserPromise);
// All promises are done here (in parallel)
```

### [`groupBy(list, path)`](/tests/groupBy.test.js)

Returns an object of {value: entry, ...} pairs based on path.
Entries contain only data that's not shared with other entries.

```js
groupBy([
  {name: "John", admin: false},
  {name: "Jane", admin: true},
  {name: "Paul", admin: false},
  {name: "Fred", admin: false}
], '*.admin') /* => {
  false: [
    {name: "John", admin: false},
    {name: "Jane", admin: true},
    {name: "Paul", admin: false},
    {name: "Fred", admin: false}
  ],
  true: [
    {name: "Jane", admin: true}
  ],
} */
```

### [`match(data, predicates)`](/tests/match.test.js)

Returns true if data matches predicates.

```js
match({a: {x: 1, y: 2}, b: 3}, {
  'a.x': v => v < 2,
  'b':   3,
}) // => true

let users = [{
  name: "Jane",
  contacts: [{email: "paul@mail.com"}],
}, {
  name: "Fred",
  contacts: [{email: "john@mail.com"}, {email: "judy@mail.com"}],
}];

// "Does someone known John ?"
match(users, {
  "*.contacts.*.email": emails => emails.indexOf('john@mail.com') !== -1,
}) // => true
```

### [`copy(data)`](/tests/copy.test.js)

Returns a copy of data to ensure that we don't change data by side-effects.

```js
let numbers  = [1, 2, 3, 4];
let previous = copy(numbers);

// Editing number with side-effects
numbers.push(5);

// Previous hasn't changed
previous // => [1, 2, 3, 4]
```

### [`tap(data)`](/tests/tap.test.js)

Returns data after applying side-effect to allow chaining

```js
// Logging without intermediate values
return tap(value, v => console.log("returned", v));

// Adding a user in a single line
return tap(users, users => users.push(user));
```

### [`parseJson(raw, defaultValue = {})`](/tests/parseJson.test.js)

Parse json without failing with invalid raw json.

```js
parseJson('{"foo":"bar"}')  // => {foo: "bar"}
parseJson('{invalid json}') // => {}
parseJson('{invalid json}', undefined) // => undefined
```

### [`deferData(fn, ...args)`](/tests/deferData.test.js)

Transform any function of this library into a function that just takes data as input. Useful for map/filter/reduce/etc.

```js
import { deferData:_, get } from '@warang580/datamix';

let names = map(users, _(get, 'name', 'unknown'));
// is equivalent to
let names = map(users, user => get(user, 'name', 'unknown'));
```

# [CHANGELOG](/CHANGELOG.md)

# [ROADMAP](/ROADMAP.md)

# Stats

[![HitCount](http://hits.dwyl.io/warang580/datamix.svg)](http://hits.dwyl.io/warang580/datamix)
