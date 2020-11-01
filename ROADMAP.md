# ROADMAP

- "getWith()" == only() ?

- rename `defaultsTo` to `coerce` or `or` ?

- `eachAsync` that doesn't care about order ? like Promise.all()

- `tap(data)` to allow returning "side-effects" that don't return "self"

```js
return tap(users, (users) => users.push(user));
```

- `mergeWith(data, (v1, v2, k?) => {/* ... */}, defaultValue?, ...datas)`

- `groupBy(data, path)` => {value: [values]}

- transducers ? (t => t.map() t.filter() ?)
