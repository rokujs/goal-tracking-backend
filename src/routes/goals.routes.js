const { Router } = require('express')
const router = Router()

const { createNewGoal, getSinceGoal, getAllGoals } = require('../controllers/goals.controller')

// new Goal
router.post('/goals/add', createNewGoal)

// All goals
router.get('/goals', getAllGoals)

// single goal
router.get('/goal/:id', getSinceGoal)

module.exports = router
