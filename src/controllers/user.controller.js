const bcrypt = require('bcrypt')
const CreateToken = require('../utils/createToken')

const User = require('../models/User')

const userCtrl = {}

userCtrl.getAllUsers = async (req, res) => {
  const users = await User.find({}).populate('goals', {
    name: 1,
    description: 1,
    timeEnd: 1,
    tries: 1,
    start: 1,
    end: 1,
    todayDone: 1
  })
  res.json(users)
}

userCtrl.createNewUser = async (req, res) => {
  try {
    const { username, password, email } = req.body

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      passwordHash,
      email
    })

    const savedUser = await newUser.save()

    const token = CreateToken(savedUser._id, savedUser.username)

    res.status(201).json({ username: savedUser.username, token })
  } catch (error) {
    res.status(400).json({ error: '`username` to be unique' })
  }
}

module.exports = userCtrl
