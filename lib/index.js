'use strict';

var resolveReferences = require('./util/resolve-references');

module.exports = function(obj, refs) {
  return resolveReferences(obj, refs);
};
