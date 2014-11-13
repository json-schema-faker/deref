tv4 = require('tv4')
clone = require('clone')
ZSchema = require('z-schema')
JaySchema = require('jayschema')

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
    ignoreUnresolvableReferences: false

  validator.setRemoteReference(id, clone(json)) for id, json of refs

  valid = validator.validate @actual, clone(expected)

  if errors = validator.getLastErrors() or not valid
    throw errors.map((e) ->
      if e.code is 'PARENT_SCHEMA_VALIDATION_FAILED'
        e.inner.map((e) -> e.message).join '\n'
      else
        e.message
    ).join('\n') or "Invalid schema #{JSON.stringify @actual}"

  validator = tv4.freshApi()
  validator.addSchema(id, clone(json)) for id, json of refs

  result = validator.validateResult(@actual, clone(expected), true)

  throw 'Missing ' + result.missing.join(', ') if result.missing.length

  throw result.error if result.error

  jay = new JaySchema
  jay.register(clone(json)) for id, json of refs

  result = jay.validate @actual, clone(expected)

  throw result.map((e) -> e.message).join('\n') or "Invalid schema #{JSON.stringify @actual}" if result.length
