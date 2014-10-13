Do you have $ref's ?
====================

A simple way for solving `$ref` values:

```javascript
var deref = require('deref');

var $ = deref();

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

console.log($(schema).schema2.nested.id);
// output: http://x.y.z/otherschema.json#bar
```

Basic usage
===========

The resulting function of calling `deref()` can accept four arguments:

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
  - `cloneSchema(schema, refs, id)`
  - `normalizeSchema(fakeroot, schema)`

Note that calling `$(schema)` will not read/download any local/remote files.

[![Build Status](https://travis-ci.org/pateketrueke/deref.png?branch=master)](https://travis-ci.org/pateketrueke/deref)
