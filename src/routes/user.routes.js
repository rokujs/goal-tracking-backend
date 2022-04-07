const { Router } = require('express')
const router = Router()

const { createNewUser, getAllUsers } = require('../controllers/user.controller')

// All users
router.get('/api/user', getAllUsers)

// new User
router.post('/api/user', createNewUser)

module.exports = router
