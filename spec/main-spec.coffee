fs = require('fs')
glob = require('glob')
deref = require('../lib')

pick = (obj, key) ->
  parts = key.split('.')
  obj = obj[parts.shift()] while parts.length
  obj

glob.sync("#{__dirname}/**/*.json").forEach (file) ->
  JSON.parse(fs.readFileSync(file)).forEach (suite) ->
    return if suite.xdescription

    describe "#{suite.description} (#{file.replace(__dirname + '/', '')})", ->
      beforeEach ->
        jasmine.addMatchers(customMatchers)

      suite.tests.forEach (test) ->
        return if test.xdescription

        it test.description, ->
          $ = deref()

          schema = if typeof test.schema is 'string'
            pick(suite, test.schema)
          else
            test.schema

          refs = test.refs?.map (ref) ->
            if typeof ref is 'string'
              pick(suite, ref)
            else
              ref

          if test.normalize
            backup = JSON.stringify(schema)
            data = try
              deref.util.normalizeSchema(schema)
            catch e
              unless test.throws
                console.log e
                throw e

            expect(backup).toBe JSON.stringify(schema)
          else
            data = try
              $(schema, refs, test.resolve)
            catch e
              {}

          if test.dump
            console.log JSON.stringify(data, null, 2)
            return

          if test.data
            try
              expect(test.data).toHaveSchema [data, $.refs]
            catch e
              unless test.throws
                console.log JSON.stringify(data, null, 2)
                throw e

          if test.hasRefs >= 0
            expect(data).toHaveRefs test.hasRefs

          if test.foundRefs
            for key, value of test.foundRefs
              found = try
                $.util.findByRef(key, $.refs)
              catch e
                null

              if typeof value is 'object'
                unless found
                  throw "Reference not found: #{key}"

                expect(pick(found, k)).toEqual(v) for k, v of value

          if test.hasProps
            expect(pick(data, k)).toEqual(v) for k, v of test.hasProps
