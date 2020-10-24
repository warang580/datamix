# Datamix

Manipulate data of different types with the same consistent API
(ie. objects and array are both key-value pairs)

**No dependencies included**

## Examples

Note: all functions work exactly the same way on arrays AND objects.

### get

```js
import { get } from "@warang580/datamix";
let response = request(/* ... */);
let userId   = get(response, 'data.user.id'); // => <someId> or `undefined`
```

### set

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

### only

```js
import { only } from "@warang580/datamix";

only({x:1, y:2}, ['x'])      // =>  {x:1}
only({a:0}, {foo: 'a'})      // =>  {foo:0}
only({}, ['a'])              // =>  {a:undefined}
only({}, ['a'], false)       // =>  {}

only(
  {a: {x: 1, y: 2}, b: {z: 3}},
  {'foo.a': 'a.x', 'foo.b': 'b.z'}
) // => {foo: {a: 1, b: 3}}
```

### getFirst

```js
import { getFirst } from "@warang580/datamix";

let user = {
  work_phone: "0456",
  home_phone: "0123",
};

let number = getFirst(user, ['mobile_phone', 'home_phone', 'work_phone'], "?"); // => "0123"
```

### isIterable

Tells you if the value can be iterated upon (null and undefined are handled as an empty array)

```js
import { isIterable } from "@warang580/datamix";

isIterable([/* ... */]) // => true
isIterable({/* ... */}) // => true
isIterable(undefined)   // => true
isIterable(null)        // => true
isIterable("hello")     // => false
isIterable(42)          // => false
```

### map

```js
import { map, get } from "@warang580/datamix";

let users = [/* ... */];
let names = map(users, user => get(user, 'name', 'unknown'));
```

### filter

```js
import { filter, get } from "@warang580/datamix";

let users  = [/* ... */];
let admins = filter(users, user => get(user, 'is_admin', false));
```


### reduce

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

### each

```js
import { each } from "@warang580/datamix";

let names = {"Jade", "John", "Fred"};

each(names, name => console.log("Hello", name));
```

### eachSync

```js
import { eachSync } from "@warang580/datamix";

let users = [/* ... */];

eachSync(users, async user => {
  await saveUser(user);
});

// Everything is done here
```

### copy

```js
import { copy } from "@warang580/datamix";

let numbers  = [1, 2, 3, 4];
let previous = copy(numbers);

// Editing number with side-effects
numbers.push(5);

// Previous hasn't changed
previous // => [1, 2, 3, 4]
```

### parseJson

```js
import { parseJson } from "@warang580/datamix";

let res = '{"foo":"bar"}';

parseJson(res) // => {foo: "bar"}
```

### fget (functional version of get)

```js
import { map, fget, get } from "@warang580/datamix";

let names = map(users, fget('name', 'unknown'));
// is equivalent to
let names = map(users, user => get(user, 'name', 'unknown'));
```

### fset (functional version of set)

```js
import { set, fset } from "@warang580/datamix";

let names = map(users, fset('connections', c => c + 1));
// is equivalent to
let names = map(users, user => set(user, 'connections', c => c + 1));
```

### fonly (functional version of only)

```js
import { only, fonly } from "@warang580/datamix";

let u = map(users, fonly(['name', 'email']));
// is equivalent to
let u = map(users, user => only(user, ['name', 'email']));
```

### fgetFirst (functional version of getFirst)

```js
import { getFirst, fgetFirst } from "@warang580/datamix";

let email = map(users, fgetFirst(['email', 'login.email', 'contact.email']));
// is equivalent to
let email = map(users, user => getFirst(user, ['email', 'login.email', 'contact.email']));
```

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

# ROADMAP

- `getMany` ?

```
let cities = getMany(data, 'users.*.addresses.*.city')
```

- prefix functional versions by "_", not "f" ?
- transducers (t => t.map() t.filter() ?) ?

# CHANGELOG

(NOTE: update package.json > version too)

## [Unreleased](https://github.com/warang580/datamix/compare/master...develop)

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

- Fixed set(null, ...) error

## 1.0.0 (2020-10-18)

Base version with `get`, `set`, `reduce`, `map`, `filter`, `each`, `eachSync`, `copy`
