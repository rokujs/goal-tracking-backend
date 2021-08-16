const Goal = require('../models/Goal')

const goalCtrl = {}

goalCtrl.createNewGoal = (req, res) => {
  const { name, description, timeEnd } = req.body

  const newGoal = new Goal({
    name,
    description,
    timeEnd,
    tries: 0,
    end: false,
    todayDone: false
  })

  newGoal.save()
  res.end()
}

goalCtrl.getAllGoals = async (req, res) => {
  const goals = await Goal.find()

  res.json(goals)
}

goalCtrl.getSinceGoal = async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  res.json(goal)
}

module.exports = goalCtrl
