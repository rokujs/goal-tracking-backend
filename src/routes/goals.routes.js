const { Router } = require('express')
const router = Router()

const { createNewGoal } = require('../controllers/goals.controller')

// new Goal
router.post('/goals/add/', createNewGoal)

router.get('/', (req, res) => {
  res.send('hola mundo')
})

module.exports = router
