tv4 = require('tv4')
ZSchema = require('z-schema')
JSONSchema = require('./fixtures/schema.json')

refCount = (node, acc = 0) ->
  acc += 1 if node.$ref

  for id, value of node
    if typeof value is 'object'
      acc += refCount(value)

  acc

jasmine.Matchers::toHaveRefs = (expected = 0) ->
  if expected isnt nodes = refCount @actual
    throw new Error "Invalid $ref count #{nodes}, expected #{expected}"

jasmine.Matchers::toHaveSchema = (expected, refs) ->
  # TODO: try other validators

  validator = new ZSchema
  validator.setRemoteReference(id, json) for id, json of refs
  validator.setRemoteReference 'http://json-schema.org/schema', JSONSchema

  valid = validator.validate @actual, expected

  if errors = validator.getLastErrors() or not valid
    throw errors.map((e) -> e.message).join '\n'

  validator = tv4.freshApi()
  validator.addSchema(id, json) for id, json of refs

  result = validator.validateResult(@actual, expected, true)

  throw 'Missing ' + result.missing.join(', ') if result.missing.length

  throw result.error if result.error
