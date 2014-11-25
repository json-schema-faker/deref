'use strict';

var $ = require('./util/uri-helpers');

$.findByRef = require('./util/find-reference');
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

    if (!Array.isArray(refs)) {
      ex = !!refs;
      refs = [];
    }

    function push(ref) {
      if (typeof ref.id === 'string') {
        var base = $.getDocumentURI(ref.id) || ref.id;

        if (/#([^\/]+)/.test(ref.id)) {
          base = ref.id.split('#')[1];

          if (!$ref.refs[base]) {
            $ref.refs[base] = {
              $ref: ref.id
            };
          }

          base = ref.id;
        }

        if (!$ref.refs[base]) {
          $ref.refs[base] = ref;
        }
      }
    }

    refs.concat([schema]).forEach(function(ref) {
      schema = $.normalizeSchema(fakeroot, ref, push);
      push(schema);
    });

    return $.resolveSchema(schema, $ref.refs, ex);
  }

  $ref.refs = {};
  $ref.util = $;

  return $ref;
};

instance.util = $;
