const { Router } = require('express')
const router = Router()

const { createNewGoal, getAllGoals, getSingleGoal, wasDone, abandonGoal, deleteGoal, resumeGoal } = require('../controllers/goals.controller')

// All goals
router.get('/goals', getAllGoals)

// new Goal
router.post('/goals/add', createNewGoal)

// Single goal
router.get('/goal/:id', getSingleGoal)

// abandon goal
router.put('/goal/:id', abandonGoal)

// done goal
router.patch('/goal/:id', wasDone)

// delete goal
router.delete('/goal/:id', deleteGoal)

// resume goal
router.patch('/goal/resume/:id', resumeGoal)

module.exports = router
