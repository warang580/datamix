# ROADMAP

- split source if multiple files (src + tests)
- split documentation in multiple files

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
