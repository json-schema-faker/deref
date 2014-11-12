require('./helpers')

$ = null
_ = require('./fixtures')

deref = require('../lib')
jsptr = require('jsonpointer')

describe 'resolving $ref values', ->
  beforeEach ->
    $ = deref()

  it 'should resolve IDs', ->
    schema = _.idSchema.schema
    $.util.normalizeSchema schema

    expect(jsptr.get(schema, '').id).toEqual 'http://x.y.z/rootschema.json#'
    expect(jsptr.get(schema, '/schema1').id).toEqual 'http://x.y.z/rootschema.json#foo'
    expect(jsptr.get(schema, '/schema2').id).toEqual 'http://x.y.z/otherschema.json#'
    expect(jsptr.get(schema, '/schema2/nested').id).toEqual 'http://x.y.z/otherschema.json#bar'
    expect(jsptr.get(schema, '/schema2/alsonested').id).toEqual 'http://x.y.z/t/inner.json#a'
    expect(jsptr.get(schema, '/schema3').id).toEqual 'some://where.else/completely#'

  it 'should resolve internal only', ->
    refs = [_.personDetails.schema, _.addressDetails.schema]
    schema = $(_.personWithAddress.schema, refs)

    expect(schema).toHaveRefs 3
    expect(Object.keys($.refs).length).toEqual 2
    expect(_.personWithAddress.example).toHaveSchema schema, $.refs

  it 'should expand dereferenced schemas', ->
    refs = [_.personDetails.schema, _.addressDetails.schema]
    schema = $(_.personWithAddress.schema, refs, true)

    expect(schema).not.toHaveRefs()
    expect(Object.keys($.refs).length).toEqual 3
    expect(_.personWithAddress.schema).toHaveRefs 3

  xit 'should test $schema', ->
    schema = $(_.schema.schema, true)
    #$.util.normalizeSchema schema
    console.log JSON.stringify(schema, null, 2)
