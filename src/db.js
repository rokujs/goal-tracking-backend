const mongoose = require('mongoose')

const { FOLLOW_UP_MONGODB_HOST, FOLLOW_UP_MONGODB_DATABASE } = process.env

const database = `mongodb://${FOLLOW_UP_MONGODB_HOST}/${FOLLOW_UP_MONGODB_DATABASE}`

mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB is connected'))
  .catch(err => console.error(err))
