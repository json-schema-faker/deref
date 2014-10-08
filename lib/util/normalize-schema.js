'use strict';

var util = require('./index'),
    jsptr = require('jsonpointer');

var SCHEMA_URI = 'http://json-schema.org/schema';

function isURL(path) {
  if (path && (path.indexOf('http:') > -1) || (path.indexOf('https:') > -1)) {
    return true;
  }
}

module.exports = function(schema) {
  if (!schema.id) {
    throw new Error('Missing id for schema "' + JSON.stringify(schema) + '"');
  }

  if (!schema.$schema) {
    schema.$schema = SCHEMA_URI;
  } else {
    schema.$schema = util.getDocumentUri(schema.$schema);
  }

  if (!isURL(schema.id)) {
    schema.id = util.resolveUrl(schema.$schema, schema.id);
  }

  if (schema.id.indexOf('#') > -1) {
    var hash = schema.id.split('#')[1];

    if (hash.charAt() === '/') {
      schema.id = jsptr.get(schema, hash);
    } else {
      schema.id = util.resolveUrl(schema.id, hash);
    }
  }

  return schema;
};
