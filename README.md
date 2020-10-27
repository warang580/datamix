# Datamix

Manipulate data of different types with the same consistent API
(ie. objects and array are both key-value pairs)

**No dependencies included**

## Installation

NPM  : `npm install @warang580/datamix`

Yarn : `yarn add @warang580/datamix`

## Usage

```js
// ES6
import Data from "@warang580/datamix";
```

```js
// NodeJS
let Data = require("@warang580/datamix");
```

## Examples

Reminder: all functions work on arrays AND objects.

### `defaultsTo(data, defaultValue = [])`

```js
let config = defaultsTo(getConfig(/* ... */), {})
```

### `get(data, path, notFoundValue = undefined)`

```js
import { get } from "@warang580/datamix";

let response = request(/* ... */);

let userId   = get(response, 'data.user.id'); // => <someId> or `undefined`
let userName = get(response, ['users', user.id, 'name'], "unknown"); // => <name> or "unknown"
```

### `set(data, path, newValue)`

```js
import { set } from "@warang580/datamix";

let user = {
  firstname: "John",
  lastname:  "Doe",
  auth: {
    login: "jdoe@email.com",
    connections: 12,
  }
};

// Updating without side-effects
user = set(user, 'age', 50);
// newValue can be a function with current value as argument
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

### `only(data, paths, withMissing = true)`

Paths should be `{oldpath: newpath, ...}`

```js
import { only } from "@warang580/datamix";

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

```js
keys({a: 1, b, 2, c: {x: 3, y: 4}}) // ['a', 'b', 'c']
```

### `values(data)`

```js
values({a: 1, b, 2, c: {x: 3, y: 4}}) // => [1, 2, {x: 3, y: 4}]
```

### `getFirst(data, paths, defaultValue = undefined)`

```js
import { getFirst } from "@warang580/datamix";

let user = {
  work_phone: "0456",
  home_phone: "0123",
};

let number = getFirst(user, ['mobile_phone', 'home_phone', 'work_phone'], "?"); // => "0123"
```

### `getAll(data, wildcardPath, withPaths = false)`

```js
import { getAll } from "@warang580/datamix";

let users = [{
  name: "Jane",
  contacts: [{email: "paul@mail.com"}, {email: "fred@mail.com"}],
}, {
  name: "Fred",
  contacts: [{email: "john@mail.com"}, {email: "judy@mail.com"}],
}];

// Only get values
getAll(users, "*.contacts.*.email") // => ["jane@mail.com", "fred@mail.com", "john@mail.com", "judy@mail.com"]

// Get paths and values (can be useful to "set" later)
getAll({list: [
  {a: [1, 2]}, {a: [3, 4, 5]}, {z: [6]}, {a: [7, 8]},
]}, 'list.*.a.*', true) /* => {
  'list.0.a.0': 1,
  'list.0.a.1': 2,
  'list.1.a.0': 3,
  'list.1.a.1': 4,
  'list.1.a.2': 5,
  'list.3.a.0': 7,
  'list.3.a.1': 8,
} */
```

### `setAll(list, wildcardPath, newValue)`

```js
setAll(list, "players.*.isDead", false)
```

### `paths(data, traverseArrays = false)`

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

paths(data)       // => ['a', 'b.x', 'b.y', 'c'],
paths(data, true) // => ['a', 'b.x', 'b.y.0', 'b.y.1', 'c.0', 'c.1'],

let list = [1, {a: 1, b: [3, 4]}, [5, 6]];

paths(list)       // => ['0', '1.a', '1.b', '2']
paths(list, true) // => ['0', '1.a', '1.b.0', '1.b.1', '2.0', '2.1']
```

### `entries(data, deep = false, traverseArrays = false)`

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

entries(data)             // => [['a', 1], ['b', {x: 2, y: [3,4]}], ['c', ['foo', 'bar']]]
entries(data, true)       // => [['a', 1], ['b.x', 2], ['b.y', [3, 4]], ['c', ['foo', 'bar']]]
entries(data, true, true) // => [['a', 1], ['b.x', 2], ['b.y.0', 3], ['b.y.1', 4], ['c.0', 'foo'], ['c.1', 'bar']]
```

### `plain(data, traverseArrays = false)`

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

paths(data)       // => {'a': 1, 'b.x': 2, 'b.y': [3, 4], 'c': ['foo', 'bar']}
paths(data, true) // => {'a': 1, 'b.x': 2, 'b.y.0': 3, 'b.y.1': 4, 'c.0': 'foo', 'c.1': 'bar'}
```

### `isIterable(data)`

Tells you if data can be iterated upon

```js
import { isIterable } from "@warang580/datamix";

isIterable([/* ... */]) // => true
isIterable({/* ... */}) // => true
isIterable(undefined)   // => false
isIterable(null)        // => false
isIterable("hello")     // => false
isIterable(42)          // => false
```

### `map(data, (v, k, data) => {...})`

```js
import { map, get } from "@warang580/datamix";

let users = [/* ... */];
let names = map(users, user => get(user, 'name', 'unknown'));
```

### `filter(data, (v, k, data) => {...})`

```js
import { filter, get } from "@warang580/datamix";

let users  = [/* ... */];
let admins = filter(users, user => get(user, 'is_admin', false));
```

### `reduce(data, (acc, v, k, data) => {...})`

```js
import { get, reduce } from "@warang580/datamix";

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

```js
import { each } from "@warang580/datamix";

let names = {"Jade", "John", "Fred"};

each(names, name => console.log("Hello", name));
```

### `eachSync(data, async (v, k, data) => {...})`

```js
import { eachSync } from "@warang580/datamix";

let users = [/* ... */];

eachSync(users, async user => {
  await saveUser(user);
});

// Everything is done here
```

### `copy(data)`

Ensuring that we don't change data by side-effects

```js
import { copy } from "@warang580/datamix";

let numbers  = [1, 2, 3, 4];
let previous = copy(numbers);

// Editing number with side-effects
numbers.push(5);

// Previous hasn't changed
previous // => [1, 2, 3, 4]
```

### `parseJson(raw, defaultValue = {})`

```js
import { parseJson } from "@warang580/datamix";

let res = '{"foo":"bar"}';

parseJson(res) // => {foo: "bar"}
```

### `_get(path, defaultValue = undefined)` (functional version of get)

```js
import { map, _get, get } from "@warang580/datamix";

let names = map(users, _get('name', 'unknown'));
// is equivalent to
let names = map(users, user => get(user, 'name', 'unknown'));
```

### `_set(path, newValue)` (functional version of set)

```js
import { map, set, _set } from "@warang580/datamix";

let names = map(users, _set('connections', c => c + 1));
// is equivalent to
let names = map(users, user => set(user, 'connections', c => c + 1));
```

### `_only(paths)` (functional version of only)

```js
import { map, only, _only } from "@warang580/datamix";

let u = map(users, _only(['name', 'email']));
// is equivalent to
let u = map(users, user => only(user, ['name', 'email']));
```

### `_getFirst(paths)` (functional version of getFirst)

```js
import { map, getFirst, _getFirst } from "@warang580/datamix";

let email = map(users, _getFirst(['email', 'login.email', 'contact.email']));
// is equivalent to
let email = map(users, user => getFirst(user, ['email', 'login.email', 'contact.email']));
```

### `_getAll(paths)` (functional version of getAll)

```js
import { map, getAll, _getAll } from "@warang580/datamix";

let roleIds = map(users, _getAll('roles.*.id'));
// is equivalent to
let roleIds = map(users, user => getAll(user, 'roles.*.id'));
```

# ROADMAP

- split ROADMAP and CHANGELOG in separate files
- same for documentation ?

- `deferData(fn, ...args)`
  - [import {deferData: _}] ?
  - or simply remove functional versions ?

- `setWith(list, pathValuePairs)`

```js
setWith({a: 1, b: 2, c: [3, 4]}, {'a': -1, 'c.0': 0}) // => {a: -1, b: 2, c: [0, 4]}
// is equivalent to
setWith({a: 1, b: 2, c: [3, 4]}, [['a', -1], ['c.0', 0]]) // => {a: -1, b: 2, c: [0, 4]}
```

- `_parseJson(defaultValue = {})`

```js
list = map(_parseJson)
```

- mergeWith(data, (v1, v2, k?) => {/* ... */}, ...datas)

- transducers ? (t => t.map() t.filter() ?)

# CHANGELOG

(NOTE: update package.json version too)

## [Unreleased](https://github.com/warang580/datamix/compare/master...develop)

## [4.0.0](https://github.com/warang580/datamix/compare/3.1.0...4.0.0) (2020-10-27)

- Breaking: renamed actual `paths` to `plain`
- Feature: `paths(data, traverseArrays = false)` => [path, ...]
- Feature: `plain(data, traverseArrays = false)` => {path: value, ...}

## [3.1.0](https://github.com/warang580/datamix/compare/3.0.0...3.1.0) (2020-10-26)

- Feature: `entries(data, deep = false, traverseArrays = false)` => [[key, value], ...]

## [3.0.0](https://github.com/warang580/datamix/compare/2.1.0...3.0.0) (2020-10-26)

- Breaking: `size(undefined|null) // => undefined`
- Breaking: `isIterable(undefined|null) // => false`
- Feature: `paths(data, traverseArrays = false)`
- Feature: `setAll(data, wildcardPath, newValue)`
- Feature: `keys(data)`
- Feature: `values(data)`
- Feature: `defaultsTo(data, defaultValue = [])`

## [2.1.0](https://github.com/warang580/datamix/compare/2.0.0...2.1.0) (2020-10-24)

- Feature: `getAll(data, path)`

## [2.0.0](https://github.com/warang580/datamix/compare/1.2.0...2.0.0) (2020-10-24)

- **Breaking**: renamed all functional versions with "_" prefix instead of "f" (eg. `fmap` => `_map`)
- Feature: `getFirst(data, paths, defaultValue = undefined)`
- Feature: `only(data, paths, withMissing = true)`
- Feature: `isIterable(data)`
- Feature: `parseJson(raw, defaultValue = {})`

## [1.2.0](https://github.com/warang580/datamix/compare/1.1.0...1.2.0) (2020-10-24)

- Feature: `fget` and `fset` are functional versions of get and set (for map/filter/reduce)
- Bugfix: handle "empty" paths correctly ("", null, undefined)
- Bugfix: you can get/set array by numerical indexes

## [1.1.0](https://github.com/warang580/datamix/compare/1.0.1...1.1.0) (2020-10-24)

- Feature: `size(data)` returns the number of elements in data

## [1.0.1](https://github.com/warang580/datamix/compare/v1.0.0...1.0.1) (2020-10-24)

- Bugfix: fixed set(null, ...) error

## 1.0.0 (2020-10-18)

Base version with `get`, `set`, `reduce`, `map`, `filter`, `each`, `eachSync`, `copy`
