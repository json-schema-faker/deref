'use strict';

var $ = require('./util/uri-helpers');

$.cloneSchema = require('./util/clone-schema');
$.normalizeSchema = require('./util/normalize-schema');

var instance = module.exports = function() {
  function $ref(fakeroot, schema, refs) {
    if (typeof fakeroot === 'object') {
      refs = schema;
      schema = fakeroot;
      fakeroot = undefined;
    }

    function pushReference(from) {
      $.normalizeSchema(fakeroot, from);

      var base = $.getDocumentURI(from.id);

      if (!$ref.refs[base]) {
        $ref.refs[base] = from;
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

    return $.cloneSchema(schema, $ref.refs);
  }

  $ref.refs = {};
  $ref.util = $;

  return $ref;
};

instance.util = $;
