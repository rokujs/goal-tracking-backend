const { Router } = require('express')
const router = Router()

const { login } = require('../controllers/login.controller')

router.post('/api/login', login)

module.exports = router
