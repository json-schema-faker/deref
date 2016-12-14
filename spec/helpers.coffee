tv4 = require('tv4')
clone = require('clone')
ZSchema = require('z-schema')
JaySchema = require('jayschema')
isMyJSONValid = require('is-my-json-valid')

refCount = (node, acc = 0) ->
  acc += 1 if node.$ref

  for id, value of node
    if typeof value is 'object'
      acc += refCount(value)

  acc

global.customMatchers =
  toHaveRefs: ->
    compare: (actual, expected = 0) ->
      if expected isnt nodes = refCount actual
        pass: false
        message: "Invalid $ref count #{nodes}, expected #{expected}"
      else
        pass: true

  toHaveSchema: ->
    compare: (actual, expected) ->
      [ expected, refs ] = expected if Array.isArray(expected)

      fail = []

      # is-my-json-valid
      validate = isMyJSONValid(expected, schemas: refs)

      unless validate(actual)
        fail.push validate.errors.map((e) -> e.desc or e.message).join('\n')

      # z-schema
      validator = new ZSchema
        ignoreUnresolvableReferences: false

      validator.setRemoteReference(k, clone(v)) for k, v of refs
      valid = validator.validate actual, clone(expected)

      if errors = validator.getLastErrors() or not valid
        fail.push errors.map((e) ->
         if e.code is 'PARENT_SCHEMA_VALIDATION_FAILED'
           e.inner.map((e) -> e.message).join '\n'
         else
           e.message
        ).join('\n') or "Invalid schema #{JSON.stringify actual}"

      # tv4
      api = tv4.freshApi()

      api.banUnknown = false
      api.cyclicCheck = false

      api.addSchema(id, clone(json)) for id, json of refs

      result = api.validateResult actual,
        clone(expected), api.cyclicCheck, api.banUnknown

      if result.missing.length
        fail.push 'Missing ' + result.missing.join(', ')

      fail.push(result.error) if result.error

      # jayschema
      jay = new JaySchema
      jay.register(clone(json)) for id, json of refs

      result = jay.validate actual, clone(expected)

      if result.length
        fail.push result.map((e) -> e.desc or e.message).join('\n') or
          "Invalid schema #{JSON.stringify actual}"

      pass: !fail.length
      message: fail.join('\n') if fail.length
