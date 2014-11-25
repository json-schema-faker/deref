fs = require('fs')
glob = require('glob')
deref = require('../lib')

pick = (obj, key) ->
  parts = key.split('.')
  obj = obj[parts.shift()] while parts.length
  obj

glob.sync("#{__dirname}/**/*.json").forEach (file) ->
  JSON.parse(fs.readFileSync(file)).forEach (suite) ->
    describe suite.description, ->
      suite.tests.forEach (test) ->
        it test.description, ->
          $ = deref()

          schema = suite.schema or test.schema or suite.schemas[test.use]

          if test.normalize
            backup = JSON.stringify(schema)
            data = deref.util.normalizeSchema(schema)

            expect(backup).toBe JSON.stringify(schema)
          else
            $(schema, test.expand)

          if test.refs >= 0
            expect(data).toHaveRefs test.refs

          if test.example
            expect(test.example).toHaveSchema data, test.refs

          if test.matches
            expect(pick(data, key)).toEqual test for key, test of test.matches
