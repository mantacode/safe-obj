var _ = typeof require === 'function' ? require('underscore') : _;

function safe(obj, path, otherwise) {
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

function allOf() {
  var paths = [], obj = {};
  if (_(arguments[1]).isArray()) {
    obj = arguments[0];
    paths = arguments[1];
  } else {
    paths = [].slice.call(arguments);
    obj = paths.shift();
  }
  if (_(obj).isObject()) {
    return _(paths).every(function(path) {
      return !!safe(obj, path);
    });
  } else {
    return false;
  }
}

function anyOf() {
  var paths = [], obj = {};
  if (_(arguments[1]).isArray()) {
    obj = arguments[0];
    paths = arguments[1];
  } else {
    paths = [].slice.call(arguments);
    obj = paths.shift();
  }
  if (_(obj).isObject()) {
    return _(paths).any(function(path) {
      return !!safe(obj, path);
    });
  } else {
    return false;
  }
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
