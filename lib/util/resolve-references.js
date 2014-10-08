'use strict';

var cloneObject = require('./clone-object'),
    normalizeSchema = require('./normalize-schema');

module.exports = function(schema, refs) {
  var set = {};

  function collect(obj) {
    for (var key in obj) {
      var value = obj[key];

      if (typeof value === 'object') {
        if (value && value.id) {
          var fixed = normalizeSchema(value);

          if (!set[fixed.id]) {
            set[fixed.id] = fixed;
          }
        } else {
          collect(value, set);
        }
      }
    }
  }

  if (Array.isArray(refs)) {
    refs.map(normalizeSchema).forEach(function(schema) {
      set[schema.id] = schema;
      collect(schema, set);
    });
  }

  schema = normalizeSchema(schema);

  if (!set[schema.id]) {
    set[schema.id] = schema;
  }

  return cloneObject(schema, set);
};
