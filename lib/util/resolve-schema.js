'use strict';

var $ = require('./uri-helpers');

var find = require('./find-reference');

function clone(obj, refs, child, expand) {
  var copy = {};

  if (Array.isArray(obj)) {
    copy = [];
  }

  if ($.isURL(obj.$ref)) {
    var fixed = find(obj.$ref, refs);

    if (fixed && expand) {
      obj = fixed;

      delete obj.$ref;
    }
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object' && !(key === 'enum' || key === 'required')) {
      copy[key] = clone(value, refs, true, expand);
    } else {
      copy[key] = value;
    }
  }

  // TODO: seriously are required or not?
  if (child) {
    if (typeof copy.$schema === 'string') {
      delete copy.$schema;
    }

    if (typeof copy.id === 'string') {
      delete copy.id;
    }
  }

  return copy;
}

module.exports = function(obj, refs, expand) {
  return clone(obj, refs, false, expand);
};
