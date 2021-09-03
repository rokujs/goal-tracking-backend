const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// initiation
const app = express()

// settings
app.set('port', process.env.PORT || 8080)
require('./utils/resetGoals')

// middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Global variables

// routes
app.use(require('./routes/goals.routes'))

module.exports = app
