'use strict';

var $ = require('./uri-helpers'),
    jsptr = require('jsonpointer');

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
        var hash = obj.$ref.split('#')[1];

        if (hash.charAt() === '/') {
          fixed = jsptr.get(refs[uri], hash);
        }

        // TODO: otherwise? (i.e. http://example.com/schema#someId)
        // console.log('REF (find by?)', obj.$ref, typeof refs[uri], uri === obj.$ref);
      }

      if (obj.$ref !== fixed.id) {
        return clone(fixed, refs, true, expand);
      }

      if (expand) {
        return fixed;
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
