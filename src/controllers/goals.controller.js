const Goal = require('../models/Goal')

const goalCtrl = {}

goalCtrl.createNewGoal = async (req, res, next) => {
  const { name, description, timeEnd, user } = req.body

  const start = new Date()

  const newGoal = new Goal({
    name,
    description,
    timeEnd,
    tries: [],
    start,
    end: false,
    todayDone: false,
    user
  })

  if (!name || !description || !timeEnd) {
    res.status(400).json({
      error: 'fields are required'
    })
  }

  try {
    const saveGoal = await newGoal.save()
    res.status(201).json({ message: 'Goal created', goal: saveGoal })
  } catch (e) {
    next(e)
  }
}

goalCtrl.getAllGoals = async (req, res) => {
  const goals = await Goal.find()

  res.json(goals)
}

goalCtrl.getSingleGoal = (req, res, next) => {
  Goal.findById(req.params.id)
    .then(goal => {
      res.json(goal)
    })
    .catch(e => next(e))
}

goalCtrl.wasDone = (req, res, next) => {
  const { todayDone } = req.body

  if (!todayDone) { return res.status(400).json({ message: 'Fields are required' }) }

  Goal.findByIdAndUpdate(req.params.id, { todayDone })
    .then(() => {
      res.status(200).json({ message: 'Goal done' })
    })
    .catch(e => next(e))
}

goalCtrl.abandonGoal = async (req, res, next) => {
  try {
    const { end, newTries } = req.body

    if (!end || !newTries) { return res.status(404).json({ message: 'Fields are required' }) }
    const { tries } = await Goal.findById(req.params.id)

    tries.push(newTries)

    await Goal.findByIdAndUpdate(req.params.id, { end, tries })

    res.status(200).json({ message: 'You have abandoned the goal', tries: tries, end: end })
  } catch (error) {
    next(error)
  }
}

goalCtrl.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id)

    if (goal === null) return res.sendStatus(404)

    res.status(204).json({ message: `The goal ${goal.name} was deleted` })
  } catch (error) {
    next(error)
  }
}

goalCtrl.resumeGoal = (req, res, next) => {
  const { newStart, newEnd } = req.body

  if (!newStart || !newEnd) { return res.status(400).json({ message: 'Fields are required' }) }

  Goal.findByIdAndUpdate(req.params.id, {
    start: newStart,
    todayDone: false,
    timeEnd: newEnd,
    end: false
  })
    .then(() => {
      res.status(200).json({ message: 'Goal resumed' })
    })
    .catch(e => next(e))
}

module.exports = goalCtrl
