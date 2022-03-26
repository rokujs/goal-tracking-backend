const { Router } = require('express')
const router = Router()

const { createNewUser, getAllUsers } = require('../controllers/user.controller')

router.get('/api/user', getAllUsers)
router.post('/api/user', createNewUser)

module.exports = router
