
const { Router } = require('express')
const router = Router()

const userExtractor = require('../middlewares/userExtractor')
const { createNewGoal, getAllGoals, getSingleGoal, wasDone, abandonGoal, deleteGoal, resumeGoal } = require('../controllers/goals.controller')

// All goals
router.get('/api/goals', userExtractor, getAllGoals)

// new Goal
router.post('/api/goals/add', userExtractor, createNewGoal)

// Single goal
router.get('/api/goal/:id', userExtractor, getSingleGoal)

// abandon goal
router.put('/api/goal/:id', userExtractor, abandonGoal)

// done goal
router.patch('/api/goal/:id', userExtractor, wasDone)

// delete goal
router.delete('/api/goal/:id', userExtractor, deleteGoal)

// resume goal
router.patch('/api/goal/resume/:id', userExtractor, resumeGoal)

module.exports = router
