$ = null
_ = require('./fixtures')

deref = require('../lib')
jsptr = require('jsonpointer')

describe 'resolving $ref values', ->
  beforeEach ->
    $ = deref()

  it 'should resolve IDs', ->
    result = $(_.idSchema.schema)

    expect(jsptr.get(result, '').id).toEqual 'http://x.y.z/rootschema.json#'
    expect(jsptr.get(result, '/schema1').id).toEqual 'http://x.y.z/rootschema.json#foo'
    expect(jsptr.get(result, '/schema2').id).toEqual 'http://x.y.z/otherschema.json#'
    expect(jsptr.get(result, '/schema2/nested').id).toEqual 'http://x.y.z/otherschema.json#bar'
    expect(jsptr.get(result, '/schema2/alsonested').id).toEqual 'http://x.y.z/t/inner.json#a'
    expect(jsptr.get(result, '/schema3').id).toEqual 'some://where.else/completely#'

  it 'should resolve internal only', ->
    refs = [_.personDetails.schema, _.addressDetails.schema]
    schema = $(_.personWithAddress.schema, refs)

    expect(schema).toHaveRefs()
    expect(Object.keys($.refs).length).toEqual 3
    expect(_.personWithAddress.example).toHaveSchema schema, $.refs

  it 'should expand dereferenced schemas', ->
    refs = [_.personDetails.schema, _.addressDetails.schema]
    schema = $(_.personWithAddress.schema, refs, true)

    expect(schema).not.toHaveRefs()
