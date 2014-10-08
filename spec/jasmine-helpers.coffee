tv4 = require('tv4')

jasmine.Matchers::toHaveSchema = (expected) ->
  tv4.validateResult(@actual, expected).valid
