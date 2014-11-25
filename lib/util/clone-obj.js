'use strict';

var clone = module.exports = function(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  var target = Array.isArray(obj) ? [] : {};

  function copy(key, value) {
    target[key] = clone(value);
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
