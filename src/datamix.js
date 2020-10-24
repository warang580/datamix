/**
 * Tells if data is an array
 * (not part of public API, just here to avoid duplications)
 */
let isArray = function (data) {
  return data instanceof Array;
}

/**
 * Tells if data is an object
 * (not part of public API, just here to avoid duplications)
 */
let isObject = function (data) {
  return data instanceof Object;
}

/**
 * Tells if data is nil (undefined or null)
 * (not part of public API, just here to avoid duplications)
 */
let isNil = function (data) {
  return data === undefined || data === null;
}

/**
 * Ensures path is an array eg. "hello.world" is transformed into ['hello', 'world]
 * (not part of public API, just here to avoid duplications)
 */
let normalizePath = function (path) {
  // Empty paths
  if (isNil(path) || path === "") {
    return [];
  }

  // Transform number like 2 into "2" so it can be split
  if (typeof path === "number") {
    path = String(path);
  }

  // Transform path into array if it's not the case already
  if (typeof path === "string") {
    path = path.split(".");
  }

  return path;
}

/**
 * Make a functional version of an existing function
 * (not part of public API, just here to avoid duplications)
 */
let makeFunctional = function (fn) {
  // @TODO: postArgs is not collected, check function arity ? or n second arg ? or boolean for "first"
  return (...preArgs) => (postArgs) => {
    return fn(postArgs, ...preArgs);
  }
}

/**
 * Copy (~clone) existing data to avoid side-effects
 */
let copy = function (data) {
  if (isArray (data)) return data.slice(0);
  if (isObject(data)) return Object.assign({}, data);

  return data;
}

/**
 * Seeks a value in a "tree" of data
 * Ex: get(user, 'address.street.number', '-')
 */
let get = function (data, path, notFoundValue = undefined) {
  // We didn't found anything, return default value
  if (isNil(data)) {
    return notFoundValue;
  }

  path = normalizePath(path)

  // We're at the end of the path, return the current data
  if (path.length === 0) {
    return data;
  }

  // Recursively fetch data
  let needle = path[0];
  let tail   = path.slice(1);

  return get(data[needle], tail, notFoundValue);
}

let isIterable = function (data) {
  return size(data) !== undefined;
}

/**
 * Reduce arbitrary data (object key-values / array)
 * Ex: reduce(data, (v, k, o) => v', initialValue)
 */
let reduce = function (data, callback, initialValue) {
  if (isArray(data)) {
    return data.reduce(callback, initialValue);
  }

  // Reduce object ourselves
  let result = initialValue
  for (let key in data) {
    if (! data.hasOwnProperty(key)) continue;
    result = callback(result, data[key], key, data);
  }
  return result;
}

/**
 * Mapping arbitrary data (object key-values / array)
 * Ex: map(data, (v, k, o) => v')
 *
 * If given an object, it updates object values
 */
let map = function (data, callback) {
  if (isArray(data)) {
    return data.map(callback);
  }

  if (isObject(data)) {
    // Use our own reducer to implement map on objects
    return reduce(data, (object, value, key) => {
      object[key] = callback(data[key], key, data);
      return object;
    }, {});
  }

  return data;
}

/**
 * Filtering arbitrary data (object key-values / array)
 * Ex: filter(data, (v, k, o) => prediate)
 *
 * If given an object, it removes key-value pairs that doesn't match given filter
 */
let filter = function (data, callback) {
  if (isArray(data)) {
    return data.filter(callback);
  }

  if (isObject(data)) {
    // Use our own reducer to implement filter on objects
    return reduce(data, (object, value, key) => {
      if (callback(data[key], key, data)) {
        object[key] = data[key];
      }
      return object;
    }, {});
  }

  return data;
}

/**
 * Edit value in a "tree" of data and return the changed object (no side-effects)
 * Ex: user = set(user, 'address.street.number', 23)
 */
let set = function (data, path, newValue) {
  // @TODO: use anonymous function to avoid copying too much data by scoping
  data = copy(data);

  path = normalizePath(path)

  // We found the value and return new value instead
  if (path.length === 0) {
    if (typeof newValue !== "function") {
      return newValue;
    }

    return newValue(data);
  }

  // Recursively edit
  let needle = path[0];
  let tail   = path.slice(1);

  // Transforming undefined variables into empty objects
  if (isNil(data)) {
    data = {};
  }

  // Update value at current depth
  data[needle] = set(data[needle], tail, newValue);

  // Return updated data
  return data;
}

/**
 * Looping over arbitrary data (object key-values / array)
 * Ex: each(data, (v, k, o) => sideEffect)
 *
 * If given an object, it calls sideEffect for each key-value pair
 */
let each = function (data, callback) {
  if (isArray(data)) {
    data.forEach(callback);
    return;
  }

  // Use our own reducer to iterate over object
  return reduce(data, (_, value, key) => {
    callback(value, key, data);
  });
}

/**
 * Looping over arbitrary data (object key-values / array) with an asynchronous callback
 * Ex: eachSync(data, (v, k, o) => asyncSideEffect)
 *
 * If given an object, it calls asyncSideEffect for each key-value pair
 */
let eachSync = async function (data, callback) {
  if (data instanceof Array) {
    // @NOTE: can't use `each` (or any callback) because of scoping of async/await
    for (let index in data) {
      await callback(data[index], parseInt(index), data);
    }
    return;
  }

  for (let key in data) {
    if (! data.hasOwnProperty(key)) continue;

    await callback(data[key], key, data);
  }
}

/**
 * Compute the size of data
 */
let size = function (data) {
  if (isNil(data))    return 0;
  if (isArray(data))  return data.length;
  if (isObject(data)) return Object.keys(data).length;

  return undefined;
}

/**
 * Parse json, uses defaultValue if parsing fails
 */
let parseJson = function (raw, defaultValue = {}) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    return defaultValue;
  }
}

/**
 * Constructs new data based on actual data and paths
 */
let only = function (data, paths, withMissing = true) {
  // Transform ['a', 'b'] into {a: 'a', b: 'b'}
  if (isArray(paths)) {
    paths = reduce(paths, (paths, v, k) => {
      return set(paths, v, v);
    }, {});
  }

  // Construct object based on paths
  return reduce(paths, (next, path, key) => {
    let value = get(data, path);

    if (isNil(value) && ! withMissing) {
      return next;
    }

    return set(next, key, value);
  }, {});
}

/**
 * Functional versions
 */
let fget  = makeFunctional(get);
let fset  = makeFunctional(set);
let fonly = makeFunctional(only);

/**
 * Exporting functions
 */
module.exports = {
  copy,
  size,
  get,
  fget,
  only,
  fonly,
  set,
  fset,
  isIterable,
  reduce,
  map,
  filter,
  each,
  eachSync,
  parseJson,
}
