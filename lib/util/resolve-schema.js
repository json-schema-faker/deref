'use strict';

var $ = require('./uri-helpers');

var find = require('./find-reference');

var deepExtend = require('deep-extend');

function pick(obj) {
  return obj[Math.floor(Math.random() * obj.length)];
}

function reduce(obj) {
  var mix = obj.anyOf || obj.oneOf;

  if (!(mix && mix.length)) {
    for (var key in obj) {
      var value = obj[key];

      if (typeof value === 'object' && !(key === 'enum' || key === 'required')) {
        reduce(value);
      }
    }

    return;
  }

  if ((obj.oneOf || obj.anyOf) && mix.length) {
    mix = [pick(mix)];
  }

  delete obj.anyOf;
  delete obj.oneOf;

  var fixed = {};

  mix.forEach(function(value) {
    deepExtend(fixed, value);
  });

  deepExtend(obj, fixed);

  while (obj.anyOf || obj.oneOf) {
    reduce(obj);
  }
}

function copy(obj, refs, parent, expand) {
  var target =  Array.isArray(obj) ? [] : {};

  if (typeof obj.$ref === 'string') {
    var base = $.getDocumentURI(obj.$ref);

    if (parent !== base || (expand && obj.$ref.indexOf('#/') > -1)) {
      var fixed = find(obj.$ref, refs);

      deepExtend(obj, fixed);

      delete obj.$ref;
    }
  }

  reduce(obj, refs);

  if (obj.allOf && expand) {
    obj.allOf.forEach(function(ref) {
      var fixed;

      if (ref.$ref) {
        fixed = find(ref.$ref, refs);
      } else {
        fixed = copy(ref, refs, parent, expand);
      }

      deepExtend(obj, fixed);
    });

    delete obj.allOf;
  }

  for (var prop in obj) {
    var value = obj[prop];

    if (typeof value === 'object' && !(prop === 'enum' || prop === 'required')) {
      target[prop] = copy(value, refs, parent, expand);
    } else {
      target[prop] = value;
    }
  }

  return target;
}

module.exports = function(obj, refs, expand) {
  var fixedId = $.resolveURL(obj.$schema, obj.id),
      parent = $.getDocumentURI(fixedId);

  return copy(obj, refs, parent, expand);
};
