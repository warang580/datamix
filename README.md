# Datamix

Manipulate data of different types with the same consistent API

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

## Installation

NPM  : `npm install datamix`

Yarn : `yarn add datamix`

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

- size() == [].length && {}.keys().length
- functional versions for map/filter/reduce/etc.
- transducers with these functions (suffix or get fcts from "mix")

# CHANGELOG

## [Unreleased](https://github.com/warang580/datamix/compare/master...develop)

## [1.0.1](https://github.com/warang580/datamix/compare/1.0.0...1.0.1) (2020-10-24)

- Fixed set(null, ...) error

## 1.0.0 (2020-10-18)

Base version with `get`, `set`, `reduce`, `map`, `filter`, `each`, `eachSync`, `copy`
