'use strict';

var $ = require('./uri-helpers');

var find = require('./find-reference');

var deepExtend = require('deep-extend');

function copy(obj, refs, parent) {
  var target =  Array.isArray(obj) ? [] : {};

  if (typeof obj.$ref === 'string') {
    var base = $.getDocumentURI(obj.$ref);

    if (parent !== base) {
      var fixed = find(obj.$ref, refs);

      deepExtend(obj, fixed);

      delete obj.$ref;
    }
  }

  for (var prop in obj) {
    var value = obj[prop];

    if (typeof value === 'object' && !(prop === 'enum' || prop === 'required')) {
      target[prop] = copy(value, refs, parent);
    } else {
      target[prop] = value;
    }
  }

  return target;
}

module.exports = function(obj, refs) {
  var fixedId = $.resolveURL(obj.$schema, obj.id),
      parent = $.getDocumentURI(fixedId);

  return copy(obj, refs, parent);
};
