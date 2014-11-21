schema =
  schema: require('./schema.json')

idSchema =
  schema: require('./idSchema.json')

refSchema =
  schema: require('./refSchema.json')

personDetails =
  schema: require('./personDetails.json')

addressDetails =
  schema: require('./addressDetails.json')

personWithAddress =
  schema: require('./personWithAddress.json')
  example: require('./example.json')

module.exports = {
  schema
  idSchema
  refSchema
  personDetails
  addressDetails
  personWithAddress
}
