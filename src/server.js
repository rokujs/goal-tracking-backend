const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

// initiation
const app = express()

// settings
app.set('port', process.env.PORT || 8080)
if (process.env.NODE_ENV !== 'jest') require('./utils/resetGoals')

// middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Global variables

// routes
app.use(require('./routes/goals.routes'))
app.use(require('./routes/user.routes'))

// middleware handle
app.use(notFound)
app.use(handleErrors)

module.exports = app
