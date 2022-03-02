const Goal = require('../models/Goal')

const goalCtrl = {}

goalCtrl.createNewGoal = (req, res) => {
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

  newGoal.save()
  res
    .status(201)
    .json({ message: 'Goal created' })
}

goalCtrl.getAllGoals = async (req, res) => {
  const goals = await Goal.find()

  res.json(goals)
}

goalCtrl.getSingleGoal = async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  res.json(goal)
}

goalCtrl.wasDone = async (req, res) => {
  const { todayDone } = req.body
  await Goal.findByIdAndUpdate(req.params.id, { todayDone })

  res
    .status(200)
    .json({ message: 'Goal done' })
}

goalCtrl.abandonGoal = async (req, res) => {
  const { end, newTries } = req.body
  const { tries } = await Goal.findById(req.params.id)

  tries.push(newTries)

  await Goal.findByIdAndUpdate(req.params.id, { end, tries })

  res
    .status(200)
    .json({ message: 'You have abandoned the goal', tries: tries })
}

goalCtrl.deleteGoal = async (req, res) => {
  const { name } = await Goal.findById(req.params.id)
  await Goal.findByIdAndDelete(req.params.id)

  res
    .status(200)
    .json({ message: `The goal ${name} was deleted` })
}

module.exports = goalCtrl
