'use strict';

var $ = require('./uri-helpers');

var SCHEMA_URI = 'http://json-schema.org/schema#';

function expand(obj, parent) {
  if (obj) {
    if (typeof obj.id === 'string') {
      parent = obj.id = $.resolveURL(parent, obj.id);
    }

    if (obj.$ref) {
      if (Object.keys(obj).length > 1) {
        throw new Error('References are exclusive: ' + JSON.stringify(obj));
      }

      obj.$ref = $.resolveURL(parent, obj.$ref);
    }
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object') {
      expand(value, parent);
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

  if (!copy.$schema) {
    copy.$schema = fakeroot || SCHEMA_URI;
  } else {
    copy.$schema = $.resolveURL(copy.$schema, fakeroot || SCHEMA_URI);
  }

  copy.id = $.resolveURL(copy.$schema, copy.id || '#');

  expand(copy, copy.id);

  return copy;
};
