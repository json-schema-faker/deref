'use strict';

var $ = require('./util/uri-helpers');

$.cloneSchema = require('./util/clone-schema');
$.normalizeSchema = require('./util/normalize-schema');

var instance = module.exports = function() {
  function $ref(fakeroot, schema, refs, ex) {
    if (typeof fakeroot === 'object') {
      ex = refs;
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

    return $.cloneSchema(schema, $ref.refs, ex);
  }

  $ref.refs = {};
  $ref.util = $;

  return $ref;
};

instance.util = $;
