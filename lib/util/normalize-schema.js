'use strict';

var $ = require('./uri-helpers');

var SCHEMA_URI = 'http://json-schema.org/schema#';

function expand(obj, parent, callback) {
  if (obj) {
    if (typeof obj.id === 'string') {
      parent = obj.id = $.resolveURL(parent, obj.id);
    }

    if (obj.$ref) {
      obj.$ref = $.resolveURL(parent, obj.$ref);
    }
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object') {
      expand(value, parent, callback);
    }
  }

  if (typeof callback === 'function') {
    callback(obj);
  }
}

function clone(obj, seen) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  var target = Array.isArray(obj) ? [] : {};

  if (seen.indexOf(obj) !== -1) {
    return target;
  }

  seen.push(obj);

  function copy(key, value) {
    target[key] = clone(value, seen);
  }

  if (Array.isArray(target)) {
    obj.forEach(function(value, key) {
      copy(key, value);
    });
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    Object.keys(obj).forEach(function(key) {
      copy(key, obj[key]);
    });
  }

  return target;
}

module.exports = function(fakeroot, schema, push) {
  if (typeof fakeroot === 'object') {
    push = schema;
    schema = fakeroot;
    fakeroot = null;
  }

  var copy = clone(schema, []);

  if (!copy.$schema) {
    copy.$schema = fakeroot || SCHEMA_URI;
  } else {
    copy.$schema = $.resolveURL(copy.$schema, fakeroot || SCHEMA_URI);
  }

  copy.id = $.resolveURL(copy.$schema, copy.id || '#');

  expand(copy, copy.id, push);

  return copy;
};
