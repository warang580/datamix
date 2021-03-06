# CHANGELOG

(NOTE: update package.json version too)

## [Unreleased](https://github.com/warang580/datamix/compare/master...develop)

## [6.2.0](https://github.com/warang580/datamix/compare/6.1.0...6.2.0) (2020-11-08)

- Feature: `eachAsync(data, callback)`

## [6.1.0](https://github.com/warang580/datamix/compare/6.0.0...6.1.0) (2020-11-08)

- Feature: `tap(data, sideEffect)` is part of public API
- Feature: `match(data, predicates)`
- Bugfix: `only()` wasn't working with arrays with dot notation (eg. `['a.b']`)
- Improved documentation

## [6.0.0](https://github.com/warang580/datamix/compare/5.0.0...6.0.0) (2020-11-01)

- Breaking: `get()` with nil path will look for nil string literal (eg. "undefined" or "null")
- Feature: `groupBy(data, path, callback = v => v)`
- Feature: `setWith(data, pathValuePairs)`

## [5.0.0](https://github.com/warang580/datamix/compare/4.0.0...5.0.0) (2020-10-27)

- Breaking: removing functional functions like `_get`, `_set`, etc.
- Feature: `deferData(fn, ...args)` to transform any function in a functional one
- Improved documentation

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
