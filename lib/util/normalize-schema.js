'use strict';

var $ = require('./uri-helpers');

var extend = require('./extend-schema');

var SCHEMA_URI = 'http://json-schema.org/schema#';

function expand(obj, parent) {
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
      expand(value, parent);
    }
  }
}

module.exports = function(fakeroot, schema) {
  if (typeof fakeroot === 'object') {
    schema = fakeroot;
    fakeroot = null;
  }

  var copy = extend(schema);

  if (!copy.$schema) {
    copy.$schema = fakeroot || SCHEMA_URI;
  } else {
    copy.$schema = $.resolveURL(copy.$schema, fakeroot || SCHEMA_URI);
  }

  copy.id = $.resolveURL(copy.$schema, copy.id || '#');

  expand(copy, copy.id);

  return copy;
};
