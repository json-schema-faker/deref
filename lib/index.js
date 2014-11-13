'use strict';

var $ = require('./util/uri-helpers');

$.resolveSchema = require('./util/resolve-schema');
$.normalizeSchema = require('./util/normalize-schema');

var instance = module.exports = function() {
  function $ref(fakeroot, schema, refs, ex) {
    if (typeof fakeroot === 'object') {
      ex = refs;
      refs = schema;
      schema = fakeroot;
      fakeroot = undefined;
    }

    if (typeof refs !== 'object') {
      ex = !!refs;
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

    return $.resolveSchema($.normalizeSchema(fakeroot, schema), $ref.refs, ex);
  }

  $ref.refs = {};
  $ref.util = $;

  return $ref;
};

instance.util = $;
