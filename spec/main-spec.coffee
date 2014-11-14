$ = null
_ = require('./fixtures')

deref = require('../lib')
jsptr = require('jsonpointer')

describe 'resolving $ref values', ->
  beforeEach ->
    $ = deref()

  it 'should resolve IDs', ->
    schema = _.idSchema.schema
    backup = JSON.stringify(schema)
    result = $.util.normalizeSchema schema

    expect(schema).toHaveRefs 0
    expect(schema.schema1.id).toBe '#foo'
    expect(backup).toBe JSON.stringify(schema)

    expect(jsptr.get(result, '').id).toEqual 'http://x.y.z/rootschema.json#'
    expect(jsptr.get(result, '/schema1').id).toEqual 'http://x.y.z/rootschema.json#foo'
    expect(jsptr.get(result, '/schema2').id).toEqual 'http://x.y.z/otherschema.json#'
    expect(jsptr.get(result, '/schema2/nested').id).toEqual 'http://x.y.z/otherschema.json#bar'
    expect(jsptr.get(result, '/schema2/alsonested').id).toEqual 'http://x.y.z/t/inner.json#a'
    expect(jsptr.get(result, '/schema3').id).toEqual 'some://where.else/completely#'

  it 'should expand dereferenced schemas', ->
    refs = [_.personDetails.schema, _.addressDetails.schema]
    schema = $(_.personWithAddress.schema, refs, true)

    expect(schema).toHaveRefs 0
    expect(Object.keys($.refs).length).toEqual 3
    expect(_.personWithAddress.schema).toHaveRefs 3
    expect(_.personWithAddress.schema.id).toBe 'personWithAddress.json'

    $.refs['http://json-schema.org/schema'] = _.schema.schema

    expect(_.personWithAddress.example).toHaveSchema schema, $.refs

    a =
      id: 'a'
      type: 'object'
      properties: b: $ref: 'b'

    b =
      id: 'b'
      type: 'string'

    c =
      id: 'c'
      type: 'array'
      items: $ref: 'a'

    expect($(c, [b, a]).id).toBe 'http://json-schema.org/c#'
    expect($(c, [b, a], true).items.properties.b.type).toBe 'string'

  it 'should pass http://json-schema.org/draft-04/schema', ->
    backup = JSON.stringify(_.schema.schema)
    schema = $('http://json-schema.org/draft-04/schema', _.schema.schema)

    expect(backup).not.toBe JSON.stringify(schema)
    expect(schema).toHaveRefs 13

    $.refs['http://json-schema.org/draft-04/schema'] = _.schema.schema

    expect(_.idSchema.schema).toHaveSchema schema, $.refs
    expect(_.personDetails.schema).toHaveSchema schema, $.refs
    expect(_.addressDetails.schema).toHaveSchema schema, $.refs
    expect(_.personWithAddress.schema).toHaveSchema schema, $.refs
