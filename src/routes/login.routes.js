const { Router } = require('express')
const router = Router()

const { login } = require('../controllers/login.controller')

// Login
router.post('/api/login', login)

module.exports = router
