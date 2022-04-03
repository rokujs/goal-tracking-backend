const jwt = require('jsonwebtoken')

function CreateToken (id, username) {
  const userForToken = {
    id: id,
    username: username
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7
  })

  return token
}

module.exports = CreateToken
