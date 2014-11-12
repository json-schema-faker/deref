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

module.exports = function(fakeroot, schema) {
  if (typeof fakeroot === 'object') {
    schema = fakeroot;
    fakeroot = null;
  }

  if (!schema.id) {
    throw new Error('Missing id for schema "' + JSON.stringify(schema) + '"');
  }

  if (!schema.$schema) {
    schema.$schema = fakeroot || SCHEMA_URI;
  } else {
    schema.$schema = fakeroot || schema.$schema;
  }

  expand(schema, schema.id);
};
