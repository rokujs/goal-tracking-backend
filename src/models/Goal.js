const { Schema, model } = require('mongoose')

const GoalSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    start: { type: Date, required: true },
    timeEnd: { type: Date, required: false },
    tries: [
      {
        start: String,
        end: String
      }
    ],
    todayDone: { type: Boolean, required: false },
    end: { type: Boolean, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
)

GoalSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = model('Goal', GoalSchema)
