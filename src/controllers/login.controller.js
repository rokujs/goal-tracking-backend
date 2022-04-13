const bcrypt = require('bcrypt')
const CreateToken = require('../utils/createToken')

const User = require('../models/User')

const loginCtrl = {}

loginCtrl.login = async (req, res) => {
  const { username, password } = req.body
  const regex = /\S+@\S+\u002e\S+/

  const findUser = (regex.test(username)) ? { email: username } : { username }

  const user = await User.findOne(findUser)
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({ message: 'Invalid username or password' })
  }

  const token = CreateToken(user._id, user.username)

  res.send({
    username: user.username,
    token
  })
}

module.exports = loginCtrl
