# Datamix

Manipulate data of different types with the same consistent API

**No dependencies included**

## Examples

```js
import { get } from "datamix";

let contact = { /* ... */ };
let zipcode = get(contact, 'address.city.zipcode');
```

*More examples are coming ...*

## Installation

NPM  : `npm install datamix`

Yarn : `yarn add datamix`

## Usage

```js
// ES6
import Data from "datamix";
```

```js
// NodeJS
let Data = require("datamix");
```

# ROADMAP

- functional versions for map/filter/reduce/etc.
- transducers with these functions (suffix or get fcts from "mix")

# CHANGELOG

## [Unreleased](https://github.com/warang580/datamix/compare/master...develop)

## [1.0.1](https://github.com/warang580/datamix/compare/1.0.0...1.0.1) (2020-10-18)

*Temporary, please ignore*

## 1.0.0 (2020-10-18)

Base version with `get`, `set`, `reduce`, `map`, `filter`, `each`, `eachSync`, `copy`
