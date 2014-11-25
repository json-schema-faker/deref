fs = require('fs')
glob = require('glob')
deref = require('../lib')

pick = (obj, key) ->
  parts = key.split('.')
  obj = obj[parts.shift()] while parts.length
  obj

glob.sync("#{__dirname}/**/*.json").forEach (file) ->
  JSON.parse(fs.readFileSync(file)).forEach (suite) ->
    describe "#{suite.description} (#{file.replace(__dirname + '/', '')})", ->
      suite.tests.forEach (test) ->
        it test.description, ->
          $ = deref()

          schema = if typeof test.schema is 'string'
            pick(suite, test.schema)
          else
            test.schema

          if test.normalize
            backup = JSON.stringify(schema)
            data = deref.util.normalizeSchema(schema)

            expect(backup).toBe JSON.stringify(schema)
          else
            $(schema, test.expand)

          if test.example
            expect(test.example).toHaveSchema data, test.refs

          if test.hasRefs >= 0
            expect(data).toHaveRefs test.hasRefs

          if test.hasKeys
            expect(pick(data, key)).toEqual test for key, test of test.hasKeys
