const userExtractor = require('../middlewares/userExtractor')

const { Router } = require('express')
const router = Router()

const { createNewGoal, getAllGoals, getSingleGoal, wasDone, abandonGoal, deleteGoal, resumeGoal } = require('../controllers/goals.controller')

// All goals
router.get('/api/goals', getAllGoals)

// new Goal
router.post('/api/goals/add', userExtractor, createNewGoal)

// Single goal
router.get('/api/goal/:id', getSingleGoal)

// abandon goal
router.put('/api/goal/:id', abandonGoal)

// done goal
router.patch('/api/goal/:id', wasDone)

// delete goal
router.delete('/api/goal/:id', deleteGoal)

// resume goal
router.patch('/api/goal/resume/:id', resumeGoal)

module.exports = router
