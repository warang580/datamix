# ROADMAP

- `branch(data, 'path')` get a partial data tree with only data specific to path that's kept (useful for filters)

- "getWith()" == only() ?

- rename `defaultsTo` to `coerce` or `or` ?

- `eachAsync` that doesn't care about order ? like Promise.all()

- `mergeWith(data, (v1, v2, k?) => {/* ... */}, defaultValue?, ...datas)`

- transducers ? (t => t.map() t.filter() ?)
