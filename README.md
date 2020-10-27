# Datamix

Manipulate data of different types with the same consistent API
(ie. objects and array are both key-value pairs)

**No dependencies included**

# Getting Started

## Installation

NPM  : `npm install @warang580/datamix`

Yarn : `yarn add @warang580/datamix`

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

Reminder: all functions work on arrays AND objects.

### `get(data, path, notFoundValue = undefined)`

Get a value in a deep data tree of values.

```js
let userId   = get(response, 'data.user.id'); // => <someId> or `undefined`
// OR (array notation)
let userName = get(users, [userId, 'name'], "unknown"); // => <name> or "unknown"
```

### `set(data, path, newValue)`

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

### `defaultsTo(data, defaultValue = [])`

Coerce a nil value (`undefined` or `null`) into another. Used to ensure that a value is always an array or object depending on needs.

```js
let config = defaultsTo(getConfig(/* ... */), {})
```

### `only(data, paths, withMissing = true)`

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

### `keys(data)`

Get all data keys, like Object.keys().

```js
keys({a: 1, b, 2, c: {x: 3, y: 4}}) // ['a', 'b', 'c']
```

### `values(data)`

Get all data keys, like Object.values().

```js
values({a: 1, b, 2, c: {x: 3, y: 4}}) // => [1, 2, {x: 3, y: 4}]
```

### `getFirst(data, paths, defaultValue = undefined)`

Get the first non-nil value using a list of possible paths in a value.

```js
let user = {
  work_phone: "0456",
  home_phone: "0123",
};

let number = getFirst(user, ['mobile_phone', 'home_phone', 'work_phone'], "?"); // => "0123"
```

### `getAll(data, wildcardPath, withPaths = false)`

Aggregate all values that match a specific paths with wildcards.

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
  'list.3.a.0': 4,
  'list.3.a.1': 5,
} */
```

### `setAll(data, wildcardPath, newValue)`

Set all values that matches path with a new value.

```js
setAll(game, "players.*.isDead", false)
setAll(game, "players.*.score",  s => (s || 0) + 1)
```

### `paths(data, traverseArrays = false)`

Get an array of all available paths in data.

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

paths(data)       // => ['a', 'b.x', 'b.y', 'c'],
paths(data, true) // => ['a', 'b.x', 'b.y.0', 'b.y.1', 'c.0', 'c.1'],

let list = [1, {a: 1, b: [3, 4]}, [5, 6]];

paths(list)       // => ['0', '1.a', '1.b', '2']
paths(list, true) // => ['0', '1.a', '1.b.0', '1.b.1', '2.0', '2.1']
```

### `entries(data, deep = false, traverseArrays = false)`

Get an array of all [path, value] in data, like `Object.entries()`.

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

entries(data)             // => [['a', 1], ['b', {x: 2, y: [3,4]}], ['c', ['foo', 'bar']]]
entries(data, true)       // => [['a', 1], ['b.x', 2], ['b.y', [3, 4]], ['c', ['foo', 'bar']]]
entries(data, true, true) // => [['a', 1], ['b.x', 2], ['b.y.0', 3], ['b.y.1', 4], ['c.0', 'foo'], ['c.1', 'bar']]
```

### `plain(data, traverseArrays = false)`

Get an object of all {path: value} in data.

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

paths(data)       // => {'a': 1, 'b.x': 2, 'b.y': [3, 4], 'c': ['foo', 'bar']}
paths(data, true) // => {'a': 1, 'b.x': 2, 'b.y.0': 3, 'b.y.1': 4, 'c.0': 'foo', 'c.1': 'bar'}
```

### `isIterable(data)`

Returns if data can be iterated upon using functions of this library.

```js
isIterable([/* ... */]) // => true
isIterable({/* ... */}) // => true
isIterable(undefined)   // => false
isIterable(null)        // => false
isIterable("hello")     // => false
isIterable(42)          // => false
```

### `map(data, (v, k, data) => {...})`

Update value on key-value pairs (reminder: all functions work on objects too).

```js
let names = map(users, user => get(user, 'name', 'unknown'));
```

### `filter(data, (v, k, data) => {...})`

Recreate a new data based on key-value filter.

```js
let admins = filter(users, user => get(user, 'is_admin', false));
```

### `reduce(data, (acc, v, k, data) => {...})`

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

### `each(data, (v, k, data) => {...})`

Iterate on key-value pairs to do side-effects.

```js
each(dictionary, word => console.log("word", word));
```

### `eachSync(data, async (v, k, data) => {...})`

Iterate on key-value pairs to do asynchronous side-effects, but synchronously and in order (avoids boilerplate).

```js
await eachSync(users, saveUserPromise);

// All promises are done here
```

### `copy(data)`

Returns a copy of data to ensure that we don't change data by side-effects.

```js
let numbers  = [1, 2, 3, 4];
let previous = copy(numbers);

// Editing number with side-effects
numbers.push(5);

// Previous hasn't changed
previous // => [1, 2, 3, 4]
```

### `parseJson(raw, defaultValue = {})`

Parse json without failing with invalid raw json.

```js
parseJson('{"foo":"bar"}')  // => {foo: "bar"}
parseJson('{invalid json}') // => {}
parseJson('{invalid json}', undefined) // => undefined
```

### `_get(path, defaultValue = undefined)`

Functional version of get.

```js
let names = map(users, _get('name', 'unknown'));
// is equivalent to
let names = map(users, user => get(user, 'name', 'unknown'));
```

### `_set(path, newValue)`

Functional version of set.

```js
let names = map(users, _set('connections', c => c + 1));
// is equivalent to
let names = map(users, user => set(user, 'connections', c => c + 1));
```

### `_only(paths)`

```js
let u = map(users, _only(['name', 'email']));
// is equivalent to
let u = map(users, user => only(user, ['name', 'email']));
```

### `_getFirst(paths)`

Functional version of getFirst.

```js
let email = map(users, _getFirst(['email', 'login.email', 'contact.email']));
// is equivalent to
let email = map(users, user => getFirst(user, ['email', 'login.email', 'contact.email']));
```

### `_getAll(paths)`

Functional version of getAll.

```js
let roleIds = map(users, _getAll('roles.*.id'));
// is equivalent to
let roleIds = map(users, user => getAll(user, 'roles.*.id'));
```

# [CHANGELOG](/CHANGELOG.md)

# [ROADMAP](/ROADMAP.md)
