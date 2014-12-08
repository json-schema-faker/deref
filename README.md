Do you have $ref's ?
====================

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

Since `0.2.1` the `$schema` and `id` are no longer required for schema normalization.

[![Build Status](https://travis-ci.org/gextech/deref.png?branch=master)](https://travis-ci.org/gextech/deref) [![NPM version](https://badge.fury.io/js/deref.png)](http://badge.fury.io/js/deref) [![Coverage Status](https://coveralls.io/repos/gextech/deref/badge.png?branch=master)](https://coveralls.io/r/gextech/deref?branch=master)
