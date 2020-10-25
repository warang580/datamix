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
 * Get the first defined values for all paths in data, defaultValue otherwise
 */
let getFirst = function (data, paths, defaultValue = undefined) {
  // Get values at each path
  let values = map(paths, path => get(data, path));

  // Remove undefined values
  values = values.filter(v => v !== undefined);

  // Get the first value, defaultValue otherwise
  return get(values, 0, defaultValue);
};

/**
 * Get all data matching wildcard paths
 */
let getAll = function (data, path, withPaths = false) {
  let isWildcard = function (needle) {
    return needle === "*";
  }

  let containsWildcard = function (path) {
    return path.indexOf('*') !== -1;
  }

  path = normalizePath(path);

  // Make a recursive function to iterate over all branches the path "contains"
  let getAllRec = function (data, path, currentPath) {
    // Ignore nil data
    if (isNil(data)) {
      return undefined;
    }

    // We're at the end of one branch of the path, return the current value with its path
    if (path.length === 0) {
      return {[currentPath.join('.')]: data};
    }

    // Recursively fetch data
    let needle = path[0];
    let tail   = path.slice(1);

    // If it's a regular path, just get the next value
    if (! isWildcard(needle)) {
      return getAllRec(data[needle], tail, currentPath.concat([needle]));
    }

    // Otherwise, construct {path: value, ...} object for each data
    return reduce(data, (paths, _, needle) => {
      // Get current iteration {path: value}
      let value = getAllRec(data[needle], tail, currentPath.concat([needle]));

      // Merge it into existing object
      return Object.assign(paths, value);
    }, {});
  }

  // Start recursivity with an empty currentPath
  let values = getAllRec(data, path, []);

  if (withPaths) return values;

  return Object.values(values || {});
};

/**
 * Set all data matching wildcard paths
 */
let setAll = function (data, path, newValue) {
  let paths = getAll(data, path, true);

  return reduce(paths, (data, _, path) => {
    return set(data, path, newValue);
  }, data);
}

/**
* Make a functional version of an existing function
* (not part of public API, just here to avoid duplications)
*/
let makeFunctional = function (fn) {
  // eg. makeFunctional(get)('some.path', 'value') will return
  // a fn that takes data as input and output the result of the full get
  // which can be used in map, filter and reduce
  return (...args) => (data) => {
    return fn(data, ...args);
  }
}

let defaultsTo = function (data, defaultValue = []) {
  return isNil(data) ? defaultValue : data;
}

let keys = function (data) {
  return reduce(data, (keys, _, key) => {
    return keys.concat([key]);
  }, []);
}

let values = function (data) {
  return reduce(data, (values, value) => {
    return values.concat([value]);
  }, []);
}

let paths = function (data, traverseArrays = false) {
  // Make a recursive function to iterate over all branches
  let pathsRec = function (data, currentPath) {
    // Iterate on all current branches
    return reduce(data, (paths, value, key) => {
      let subpath = currentPath.concat([key]);

      // Merge path-value pairs of sub-branch
      if (isIterable(value)) {
        // Empty array/object
        if (size(value) === 0) {
          paths[subpath.join('.')] = isArray(value) ? [] : {};
        }
        // Array that we might not want to traverse
        else if (! traverseArrays && isArray(value)) {
          paths[subpath.join('.')] = value;
        }
        // Recursively fetch sub branches
        else {
          paths = Object.assign(paths, pathsRec(value, subpath));
        }
      }
      // Assign current {path: value} pair
      else {
        paths[subpath.join('.')] = value;
      }

      return paths;
    }, {});
  }

  // Start recursivity with an empty currentPath
  return pathsRec(data, []);
}

/**
* Functional versions
*/

let _get      = makeFunctional(get);
let _set      = makeFunctional(set);
let _only     = makeFunctional(only);
let _getFirst = makeFunctional(getFirst);
let _getAll   = makeFunctional(getAll);

/**
 * Exporting functions
 */
module.exports = {
  copy,
  size,
  defaultsTo,
  get, _get,
  getFirst, _getFirst,
  getAll, _getAll,
  only, _only,
  set, _set,
  setAll,
  keys, values,
  paths,
  isIterable,
  reduce,
  map,
  filter,
  each,
  eachSync,
  parseJson,
}
