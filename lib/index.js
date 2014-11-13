'use strict';

var $ = require('./util/uri-helpers');

$.resolveSchema = require('./util/resolve-schema');
$.normalizeSchema = require('./util/normalize-schema');

var instance = module.exports = function() {
  function $ref(fakeroot, schema, refs) {
    if (typeof fakeroot === 'object') {
      refs = schema;
      schema = fakeroot;
      fakeroot = undefined;
    }

    if (typeof refs !== 'object') {
      refs = [];
    }

    function pushReference(from) {
      var fixed = $.normalizeSchema(fakeroot, from);

      var base = $.getDocumentURI(fixed.id);

      if (!$ref.refs[base]) {
        $ref.refs[base] = fixed;
      }
    }

    if (Array.isArray(refs)) {
      refs.forEach(pushReference);
    } else {
      for (var key in refs) {
        pushReference(refs[key]);
      }
    }

    pushReference(schema);

    return $.resolveSchema($.normalizeSchema(fakeroot, schema), $ref.refs);
  }

  $ref.refs = {};
  $ref.util = $;

  return $ref;
};

instance.util = $;
