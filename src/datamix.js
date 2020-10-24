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

  // Transform path into array if it's not the case already
  if (typeof path === "string") {
    path = path.split(".");
  }

  // We're at the end of the path, return the current data
  if (path.length === 0) {
    return data;
  }

  // Recursively fetch data
  let needle = path[0];
  let tail   = path.slice(1);

  return get(data[needle], tail, notFoundValue);
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

  // Transform path into array if it's not the case already
  if (typeof path === "string") {
    path = path.split(".");
  }

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
      // @NOTE: +index = parseNumber(index)
      await callback(data[index], +index, data);
    }
    return;
  }

  for (let key in data) {
    if (! data.hasOwnProperty(key)) continue;

    await callback(data[key], key, data);
  }
}

module.exports = { copy, get, set, reduce, map, filter, each, eachSync }
