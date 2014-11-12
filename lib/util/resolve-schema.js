'use strict';

var $ = require('./uri-helpers'),
    jsptr = require('jsonpointer');

var clone = module.exports = function(obj, refs) {
  var copy = {};

  if (Array.isArray(obj)) {
    copy = [];
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

      return clone(fixed, refs);
    }

    return obj;
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object') {
      copy[key] = clone(value, refs);
    } else {
      copy[key] = value;
    }
  }

  return copy;
};
