const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  goals: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Goal'
    }
  ]
})

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

UserSchema.plugin(uniqueValidator)

module.exports = model('User', UserSchema)
