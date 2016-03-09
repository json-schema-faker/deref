
Do you have $ref's ?
====================

[![Build Status](https://travis-ci.org/json-schema-faker/deref.png?branch=master)](https://travis-ci.org/json-schema-faker/deref)
[![NPM version](https://badge.fury.io/js/deref.png)](http://badge.fury.io/js/deref)
[![Coverage Status](https://codecov.io/github/json-schema-faker/deref/coverage.svg)](https://codecov.io/github/json-schema-faker/deref)

A simple way for solving `$ref` values:

```javascript
var deref = require('deref');
```

Schema dereferencing
--------------------

```javascript
$ = deref();

var a = {
  id: 'a',
  type: 'object',
  properties: {
    b: {
      $ref: 'b'
    }
  }
};

var b = {
  id: 'b',
  type: 'string'
};

var c = {
  id: 'c',
  type: 'array',
  items: {
    $ref: 'a'
  }
};

console.log($(c, [b, a]).id);
// output: http://json-schema.org/c#

console.log($(c, [b, a], true).items.properties.b.type);
// output: string
```

Schema normalization
--------------------

```javascript
var schema = {
  id: 'http://x.y.z/rootschema.json#',
  schema1: {
    id: '#foo'
  },
  schema2: {
    id: 'otherschema.json',
    nested: {
      id: '#bar'
    },
    alsonested: {
      id: 't/inner.json#a'
    }
  },
  schema3: {
    id: 'some://where.else/completely#'
  }
};

console.log(deref.util.normalizeSchema(schema).schema2.nested.id);
// output: http://x.y.z/otherschema.json#bar
```

Schema identity
---------------

Since `0.3.0` the schema `id` will always be normalized internally to `#` when it's not provided.

This way the passed schema can be self-referenced using `$ref`'s which is the expected behavior.

I know the `id` keyword is not required but while `#/` is a self-reference we can assume `#` as the schema-id.

`deref` use that `id` for store and find `$ref`'s, even self-references.

Without it is complex determine what to resolve. :beers:

Basic usage
===========

The resulting function of calling `deref()` can accept three arguments:

- **fakeroot** (string)

  Used on missing `$schema` values for resolve into fully qualified URIs.

  ```javascript
  console.log($('http://example.com', { id: '#foo' }).id);
  // output: http://example.com#foo
  ```

  If missing will use `http://json-schema.org/schema`.

- **schema** (object)

  The JSON-Schema object for dereferencing.

- **refs** (array)

  Any additional schemas used while dereferencing.

  Since `0.2.4` passing an object is not longer supported.

- **ex** (boolean)

  Whether do full dereferencing or not, `false` by default.

  Since `0.6.0` all inner references are not dereferenced by default.

  All other references are always dereferenced regardless the value of `ex`.

Examples
--------

```javascript
$('http://example.com', schema, true);
$(schema, refs, true);
$(schema, true);
```

Utilities
---------

Aside the basics of `$`, this function will include:

- **$.refs** (object)

  An registry of dereferenced schemas.

- **$.util** (object)

  Exposes the internal helpers used by `deref`.

  - `isURL(path)`
  - `parseURI(href)`
  - `resolveURL(base, href)`
  - `getDocumentURI(path)`
  - `findByRef(uri, refs)`
  - `resolveSchema(schema, refs)`
  - `normalizeSchema(fakeroot, schema)`

Any `refs` passed MUST be an object of normalized schemas.

Note that calling `$(schema)` will not read/download any local/remote files.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/json-schema-faker/deref/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

