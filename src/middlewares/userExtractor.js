const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization

  if (!authorization || !authorization.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ error: 'Token is not valid' })
  }

  const token = authorization.split(' ')[1]
  let decoded = {}

  try {
    decoded = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    next(error)
  }

  if (!token || !decoded.id) {
    return res.status(401).json({ error: 'Token is not valid' })
  }

  const { id: userId } = decoded
  req.userId = userId

  next()
}
