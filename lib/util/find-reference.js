'use strict';

var $ = require('./uri-helpers');

var cloneObj = require('./clone-obj');

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
  var target = refs[id.split('#')[1]] || refs[$.getDocumentURI(id) || id];

  if (id.indexOf('#/') > -1) {
    return get(target, id);
  }

  if (!target) {
    throw new Error('Reference not found: ' + id);
  }

  if (id !== target.id) {
    target = cloneObj(target, []);
    target.id = $.resolveURL(target.id, id);
  }

  return target;
};
