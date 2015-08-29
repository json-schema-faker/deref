'use strict';

var find = require('./find-reference');

function copy(obj, refs) {
  var target =  Array.isArray(obj) ? [] : {};

  if (typeof obj.$ref === 'string') {
    obj = find(obj.$ref, refs);
  }

  for (var prop in obj) {
    var value = obj[prop];

    if (typeof value === 'object' && !(prop === 'enum' || prop === 'required')) {
      target[prop] = copy(value, refs);
    } else {
      target[prop] = value;
    }
  }

  return target;
}

module.exports = function(obj, refs) {
  return copy(obj, refs);
};
