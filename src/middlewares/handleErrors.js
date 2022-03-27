const ERROR_HANDLERS = {
  CastError: ({ res }) => res.status(400).send({ error: 'malformatted id' }),
  ValidationError: ({ res, error }) => res.status(409).send({ error: error.message }),
  JsonWebTokenError: ({ res }) => res.status(401).json({ error: 'token missing or invalid' }),
  TokenExpirerError: ({ res }) => res.status(401).json({ error: 'token expired' }),
  defaultError: (res) => res.status(500).send('Something broke!')
}

module.exports = (error, req, res, next) => {
  console.error('error name:', error.name)
  const handler =
    ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler({ res, error })
}
