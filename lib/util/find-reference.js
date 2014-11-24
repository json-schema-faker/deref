'use strict';

var $ = require('./uri-helpers');

function get(obj, path) {
  var hash = path.split('#')[1];

  var parts = hash.split('/').slice(1);

  while (parts.length) {
    var key = decodeURIComponent(parts.shift()).replace(/~1/g, '/').replace(/~0/g, '~');

    if (typeof obj[key] === 'undefined') {
      throw new Error('Reference not found: ' + path);
    }

    obj = obj[key];
  }

  return obj;
}

module.exports = function(id, refs) {
  var uri = id.split('#')[1],
      base = $.getDocumentURI(id) || id,
      target = refs[id] || refs[uri] || refs[base];

  if (!target) {
    throw new Error('Reference not found: ' + id);
  }

  if (id.indexOf('#/') > -1) {
    return get(target, id);
  }

  return target;
};
