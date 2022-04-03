const bcrypt = require('bcrypt')
const CreateToken = require('../utils/createToken')

const User = require('../models/User')

const loginCtrl = {}

loginCtrl.login = async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({ error: 'Invalid username or password' })
  }

  const token = CreateToken(user._id, user.username)

  res.send({
    username: user.username,
    token
  })
}

module.exports = loginCtrl
