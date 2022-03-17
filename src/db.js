const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const database = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB is connected'))
  .catch(err => console.error(err))

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})
