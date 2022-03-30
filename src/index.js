require('dotenv').config()

const app = require('./server')
require('./db.js')

const server = app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`)
})

module.exports = server
