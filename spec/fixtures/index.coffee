schema =
  schema: require('./schema.json')

idSchema =
  schema: require('./idSchema.json')

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
  personDetails
  addressDetails
  personWithAddress
}
