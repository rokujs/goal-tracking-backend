const { Schema, model } = require('mongoose')

const GoalSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  timeEnd: { type: Date, required: false },
  tries: { type: Number, required: false },
  todayDone: { type: Boolean, required: false },
  end: { type: Boolean, required: true }
},
{
  timestamps: true
})

module.exports = model('Goal', GoalSchema)
