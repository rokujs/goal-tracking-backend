const Goal = require('../models/Goal')

const goalCtrl = {}

goalCtrl.createNewGoal = (req, res) => {
  const { name, description, end } = req.body

  const newGoal = new Goal({ name, description, end })

  newGoal.save()
  res.end()
}

module.exports = goalCtrl
