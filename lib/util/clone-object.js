'use strict';

var util = require('./index');

function clone(obj, refs, parent) {
  var copy = {};

  if (!obj) {
    return null;
  }

  if (!parent) {
    parent = obj;
  }

  if (obj.$ref && typeof obj.$ref === 'string') {
    obj.$ref = util.resolveUrl(obj.id || parent.id, obj.$ref);

    if (refs[obj.$ref]) {
      return clone(refs[obj.$ref], refs, obj);
    }

    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(function(value) {
      return typeof value === 'object' ? clone(value, refs, parent) : value;
    });
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object') {
      copy[key] = clone(value, refs, obj);
    } else {
      copy[key] = value;
    }
  }

  return copy;
}

module.exports = clone;
