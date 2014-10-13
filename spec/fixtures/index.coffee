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
  idSchema
  personDetails
  addressDetails
  personWithAddress
}
