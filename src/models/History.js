const { Schema, model } = require('mongoose')

const Tries = new Schema({
  start: { type: String, required: true },
  end: { type: String, required: true }
})

const HistorySchema = new Schema({
  user: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  tries: Tries
})

module.exports = model('History', HistorySchema)
