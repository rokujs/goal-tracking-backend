const Goal = require('../models/Goal')

const goalCtrl = {}

goalCtrl.createNewGoal = (req, res) => {
  const { name, description, timeEnd, start, user } = req.body

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
  const { end, tries } = req.body
  const { name } = await Goal.findById(req.params.id)
  await Goal.findByIdAndUpdate(req.params.id, { end, tries })

  res.statusCode(200)
}

goalCtrl.deleteGoal = async (req, res) => {
  const { name } = await Goal.findById(req.params.id)
  await Goal.findByIdAndDelete(req.params.id)

  res
    .status(200)
    .json({ message: `The goal ${name} was deleted` })
}

module.exports = goalCtrl
