'use strict';

var $ = require('./uri-helpers');

var SCHEMA_URI = 'http://json-schema.org/schema';

var normalizeSchema = module.exports = function(fakeroot, schema) {
  if (!schema.id) {
    throw new Error('Missing id for schema "' + JSON.stringify(schema) + '"');
  }

  if (!schema.$schema) {
    schema.$schema = fakeroot || SCHEMA_URI;
  } else {
    schema.$schema = fakeroot || schema.$schema;
  }

  if (!$.isURL(schema.id)) {
    schema.id = $.resolveURL(schema.$schema, schema.id);
  }

  function expand(obj, parent) {
    if (parent) {
      if (obj.id) {
        normalizeSchema($.resolveURL(parent || SCHEMA_URI, obj.id), obj);
      }

      if (obj.$ref && !$.isURL(obj.$ref)) {
        obj.$ref = $.resolveURL(obj.id || parent || SCHEMA_URI, obj.$ref);
      }
    }

    for (var key in obj) {
      var value = obj[key];

      if (typeof value === 'object' && !(key === 'enum' || key === 'required')) {
        expand(value, obj.id || parent);
      }
    }
  }

  expand(schema);
};
