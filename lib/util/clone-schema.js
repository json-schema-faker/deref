'use strict';

var $ = require('./uri-helpers'),
    jsptr = require('jsonpointer');

var clone = module.exports = function(obj, refs, combine) {
  var copy = {};

  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    if (!combine) {
      return obj.slice();
    }

    return obj.map(function(schema) {
      return clone(schema, refs, true);
    });
  }

  if ($.isURL(obj.$ref)) {
    var uri = $.getDocumentURI(obj.$ref) || obj.$ref;

    if (refs[uri]) {
      var fixed = refs[uri];

      if (obj.$ref.indexOf('#') > -1) {
        var hash = obj.$ref.split('#')[1];

        if (hash.charAt() === '/') {
          fixed = jsptr.get(refs[uri], hash);
        }

        // TODO: otherwise? (i.e. http://example.com/schema#someId)
        // console.log('REF (find by?)', obj.$ref, typeof refs[uri], uri === obj.$ref);
      }

      if (combine) {
        return clone(fixed, refs, true);
      }

      return fixed;
    }

    return obj;
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object' && !(key === 'enum' || key === 'required')) {
      copy[key] = clone(value, refs, combine);
    } else {
      copy[key] = value;
    }
  }

  return copy;
};
