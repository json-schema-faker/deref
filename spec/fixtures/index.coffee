tv4 = require('tv4')

idSchema =
  schema:
    id: 'http://x.y.z/rootschema.json#'
    schema1:
      id: '#foo'
    schema2:
      id: 'otherschema.json'
      nested:
        id: '#bar'
      alsonested:
        id: 't/inner.json#a'
    schema3:
      id: 'some://where.else/completely#'

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
    required: [].concat(personDetails.schema.required).concat(addressDetails.schema.required)
  example:
    firstName: 'John'
    lastName: 'Doe'
    street: '5th avenue'
    city: 'L.A. U.S.A.'

module.exports = {
  idSchema
  personDetails
  addressDetails
  personWithAddress
}
