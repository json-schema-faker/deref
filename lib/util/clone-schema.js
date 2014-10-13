'use strict';

var $ = require('./uri-helpers'),
    jsptr = require('jsonpointer');

var clone = module.exports = function(obj, refs, parent) {
  var copy = {};

  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(function(schema) {
      return clone(schema, refs, parent);
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

      return fixed;
    }

    return obj;
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object' && !(key === 'enum' || key === 'required')) {
      copy[key] = clone(value, refs, obj.id || obj.$schema || parent);
    } else {
      copy[key] = value;
    }
  }

  return copy;
};
