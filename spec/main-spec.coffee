_ = require('./fixtures')

deref = require('../lib')

describe 'resolving $ref values', ->
  it 'should resolve internal only', ->
    expect(_.personWithAddress.example).toHaveSchema deref(_.personWithAddress.schema, _.schemas)
