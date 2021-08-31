const { Schema, model } = require('mongoose')

const GoalSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    timeEnd: { type: Date, required: false },
    tries: [
      {
        start: String,
        end: String
      }
    ],
    todayDone: { type: Boolean, required: false },
    start: { type: String, required: true },
    end: { type: Boolean, required: true },
    user: { type: String, require: true }
  },
  {
    timestamps: true
  }
)

module.exports = model('Goal', GoalSchema)
