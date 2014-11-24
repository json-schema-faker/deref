'use strict';

var clone = module.exports = function(obj, seen) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  var target = Array.isArray(obj) ? [] : {};

  if (seen.indexOf(obj) !== -1) {
    return target;
  }

  seen.push(obj);

  function copy(key, value) {
    target[key] = clone(value, seen);
  }

  if (Array.isArray(target)) {
    obj.forEach(function(value, key) {
      copy(key, value);
    });
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    Object.keys(obj).forEach(function(key) {
      copy(key, obj[key]);
    });
  }

  return target;
};
