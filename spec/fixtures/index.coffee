tv4 = require('tv4')

_ = require('../../lib/util/normalize-schema')

personDetails =
  schema:
    id: 'personDetails'
    type: 'object'
    properties:
      firstName: type: 'string'
      lastName: type: 'string'
    required: ['firstName', 'lastName']

addressDetails =
  schema:
    id: 'addressDetails'
    type: 'object'
    properties:
      street: type: 'string'
      city: type: 'string'
    required: ['street', 'city']

personWithAddress =
  schema:
    id: 'personWithAddress'
    allOf: [
      { $ref: '#someUser' }
      { $ref: '#/schemas/address' }
      { $ref: 'path/to/undefinedSchema' }
      { $ref: 'http://example.com/dummy' }
    ]
    schemas:
      person:
        id: '#someUser'
        $ref: 'personDetails'
      address:
        $ref: 'addressDetails'
    required: [].concat(
        personDetails.schema.required
        addressDetails.schema.required
      )
  example:
    firstName: 'John'
    lastName: 'Doe'
    street: '5th avenue'
    city: 'L.A. U.S.A.'

module.exports = {
  personDetails
  addressDetails
  personWithAddress
}

module.exports.schemas = []

for name, fixture of module.exports
  if fixture.schema
    fixed = _(fixture.schema)

    tv4.addSchema fixed.id, fixture.schema
    module.exports.schemas.push fixture.schema
