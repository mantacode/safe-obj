var _ = typeof require === 'function' ? require('underscore') : _;

function safe(obj, path, otherwise) {
  if (!path) {
    return otherwise;
  }
  obj = _(obj).isObject()  && obj !== null ? obj : {};
  var props = path.split('.');
  if (props.length === 1) {
    if (typeof obj[props[0]] === 'undefined') {
      return otherwise;
    } else if (obj[props[0]] === null) {
      return typeof otherwise === 'undefined' ? null : otherwise;
    } else {
      return obj[props.shift()];
    }
  } else {
    var prop = props.shift();
    return _(obj[prop]).isObject() ? safe(obj[prop], props.join('.'), otherwise) : otherwise;
  }
}

function expand(obj, path, thing) {
  if (!path || typeof thing === 'undefined') {
    return;
  }
  obj = _(obj).isObject() && obj !== null ? obj : {};
  var props = path.split('.');
  if (props.length === 1) {
    obj[props.shift()] = thing;
  } else {
    var prop = props.shift();
    if (!(prop in obj)) {
      obj[prop] = {};
    }
    expand(obj[prop], props.join('.'), thing);
  }
}

function ensure(obj, path, disallowed, otherwise) {
  if (arguments.length === 3) {
    otherwise = disallowed;
    disallowed = [];
  }
  var current = safe(obj, path);
  if  (!current || _(disallowed).any(function(item) { return _(item).isEqual(current); })) {
    expand(obj, path, otherwise);
  }
}

function anyOrAll(method, _args) {
  var paths = [], obj = {};

  // args is of type Arguments
  var args = [].slice.call(_args);

  // Allow array or list of strings
  if (_(args[1]).isArray()) {
    obj = args[0];
    paths = args[1];
  } else {
    paths = args;
    obj = paths.shift();
  }

  if (_(obj).isObject()) {
    return _[method](paths, function(path) {
      return !!safe(obj, path);
    });
  } else {
    return false;
  }
  
}

function allOf() {
  return anyOrAll.apply(_, ['every'].concat(arguments));
}

function anyOf() {
  return anyOrAll.apply(_, ['any'].concat(arguments));
}

function noneOf() {
  return !anyOf.apply(_, arguments);
}

if (typeof module === 'object') {
  module.exports = {
    safe: safe,
    expand: expand,
    ensure: ensure,
    allOf: allOf,
    anyOf: anyOf,
    noneOf: noneOf
  };
}
