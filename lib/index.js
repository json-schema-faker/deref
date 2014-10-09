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
      $ref.refs[$.getDocumentURI(from.id)] = from;
    }

    if (Array.isArray(refs)) {
      refs.forEach(pushReference);
    } else {
      $ref.refs = refs || {};
    }

    pushReference(schema);

    return $.cloneSchema(schema, $ref.refs);
  }

  $ref.refs = {};
  $ref.util = $;

  return $ref;
};

instance.util = $;
