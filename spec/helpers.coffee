tv4 = require('tv4')
clone = require('clone')
JaySchema = require('jayschema')
isMyJSONValid = require('is-my-json-valid')

refCount = (node, acc = 0) ->
  acc += 1 if node.$ref

  for id, value of node
    if typeof value is 'object'
      acc += refCount(value)

  acc

jasmine.Matchers::toHaveRefs = (expected = 0) ->
  if expected isnt nodes = refCount @actual
    throw new Error "Invalid $ref count #{nodes}, expected #{expected}"

  true

jasmine.Matchers::toHaveSchema = (expected, refs) ->
  validate = isMyJSONValid(expected, schemas: refs)

  unless validate(@actual)
    throw new Error validate.errors
      .map((e) -> e.desc or e.message)
      .join('\n')

  api = tv4.freshApi()

  api.banUnknown = false
  api.cyclicCheck = false

  api.addSchema(id, json) for id, json of refs

  result = api.validateResult @actual,
    clone(expected), api.cyclicCheck, api.banUnknown

  if result.missing.length
    throw new Error 'Missing ' + result.missing.join(', ')

  throw result.error if result.error

  jay = new JaySchema
  jay.register(clone(json)) for id, json of refs

  result = jay.validate @actual, clone(expected)

  throw result.map((e) -> e.desc or e.message).join('\n') or
    "Invalid schema #{JSON.stringify @actual}" if result.length

  true
