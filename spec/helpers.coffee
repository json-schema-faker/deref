jasmine.Matchers::toHaveRefs = (expected = 0) ->
  nodes = 0

  traverse = (node) ->
    nodes += 1 if node.$ref
    traverse(value) for id, value of node when typeof value is 'object'

  traverse @actual

  if expected isnt nodes
    throw new Error "Invalid $ref count #{nodes}, expected #{expected}"

jasmine.Matchers::toHaveSchema = (expected, refs) ->
  # TODO: try other validators
  tv4 = require('tv4').freshApi()
  tv4.addSchema(id, schema) for id, schema of refs

  result = tv4.validateResult(@actual, expected, true)

  throw result.error if result.error
