const express = require('express')

// initiation
const app = express()

// settings
app.set('port', process.env.PORT || 3001)

// middleware
app.use(express.json())

// Global variables

// routes
app.use(require('./routes/goals.routes'))

module.exports = app
