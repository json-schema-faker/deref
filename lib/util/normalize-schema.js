'use strict';

var $ = require('./uri-helpers');

var cloneObj = require('./clone-obj');

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

    if (typeof value === 'object' && !(key === 'enum' || key === 'required')) {
      expand(value, parent, callback);
    }
  }

  if (typeof callback === 'function') {
    callback(obj);
  }
}

module.exports = function(fakeroot, schema, push) {
  if (typeof fakeroot === 'object') {
    push = schema;
    schema = fakeroot;
    fakeroot = null;
  }

  var copy = cloneObj(schema),
      base = $.resolveURL(copy.$schema || SCHEMA_URI, fakeroot || '');

  copy.id = $.resolveURL(base, copy.id || '#');

  expand(copy, copy.id, push);

  return copy;
};
