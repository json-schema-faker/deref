'use strict';

var $ = require('./uri-helpers');

var extend = require('./extend-schema');

function get(obj, path) {
  var hash = path.split('#')[1];

  if (hash.charAt() === '/') {
    var parts = hash.replace(/~1/g, '/').replace(/~0/g, '~').split('/').slice(1);

    while (parts.length) {
      var key = parts.shift();

      if (typeof obj[key] === 'undefined') {
        throw new Error('Reference not found: ' + path);
      }

      obj = obj[key];
    }

    return obj;
  }
}

function clone(obj, refs, child, expand) {
  var copy = {};

  if (Array.isArray(obj)) {
    copy = [];
  }

  if ($.isURL(obj.$ref)) {
    var uri = $.getDocumentURI(obj.$ref) || obj.$ref;

    if (refs[uri]) {
      var fixed = refs[uri];

      if (obj.$ref.indexOf('#') > -1) {
        fixed = get(fixed, obj.$ref) || fixed;
      }

      if (obj.$ref !== fixed.id) {
        return clone(fixed, refs, true, expand);
      }

      if (expand) {
        obj = extend(fixed, obj);

        delete obj.$ref;
      }
    }
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object') {
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
