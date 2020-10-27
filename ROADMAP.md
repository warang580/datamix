# ROADMAP

- split source if multiple files (src + tests)

- `deferData(fn, ...args)`
  - [import {deferData: _}] ?
  - or simply remove functional versions ?

- `setWith(list, pathValuePairs)`

```js
setWith({a: 1, b: 2, c: [3, 4]}, {'a': -1, 'c.0': 0}) // => {a: -1, b: 2, c: [0, 4]}
// is equivalent to
setWith({a: 1, b: 2, c: [3, 4]}, [['a', -1], ['c.0', 0]]) // => {a: -1, b: 2, c: [0, 4]}
```

- rename `defaultsTo` to `coerce` or `or` ?

- `eachAsync` that doesn't care about order ? like Promise.all()

- `tap(data)` to allow returning "side-effects" that don't return "self"

```js
return tap(users, (users) => users.push(user));
```

- mergeWith(data, (v1, v2, k?) => {/* ... */}, ...datas)

- transducers ? (t => t.map() t.filter() ?)