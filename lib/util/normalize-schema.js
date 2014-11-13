'use strict';

var $ = require('./uri-helpers');

var SCHEMA_URI = 'http://json-schema.org/schema';

function expand(obj, parent) {
  if (obj) {
    if (obj.$ref && !$.isURL(obj.$ref)) {
      obj.$ref = $.resolveURL(parent, obj.$ref);
    }

    if (typeof obj.id === 'string' && !$.isURL(obj.id)) {
      obj.id = $.resolveURL(parent === obj.id ? SCHEMA_URI : parent, obj.id);
    }
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object') {
      expand(value, typeof obj.id === 'string' ? obj.id : parent);
    }
  }
}

function clone(obj, seen) {
  var target = {};

  seen = seen || [];

  if (seen.indexOf(obj) !== -1) {
    return target;
  }

  seen.push(obj);

  if (Array.isArray(obj)) {
    target = [];
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      target[key] = typeof obj[key] === 'object' ? clone(obj[key], seen) : obj[key];
    }
  }

  return target;
}

module.exports = function(fakeroot, schema) {
  if (typeof fakeroot === 'object') {
    schema = fakeroot;
    fakeroot = null;
  }

  var copy = clone(schema);

  if (!copy.id) {
    throw new Error('Missing id for schema "' + JSON.stringify(copy) + '"');
  }

  if (!copy.$schema) {
    copy.$schema = fakeroot || SCHEMA_URI;
  } else {
    copy.$schema = $.resolveURL(copy.$schema, fakeroot || SCHEMA_URI);
  }

  expand(copy, $.resolveURL(copy.$schema, copy.id));

  return copy;
};
