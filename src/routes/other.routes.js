const { Router } = require('express')
const router = Router()

const { home } = require('../controllers/other.controller')

// Home
router.get('/', home)

router.get('/home', home)

module.exports = router
