const Goal = require('../models/Goal')
const User = require('../models/User')

const goalCtrl = {}

// post /api/goals/add
goalCtrl.createNewGoal = async (req, res, next) => {
  const { body, userId } = req

  const { name, description, timeEnd, start } = body

  const user = await User.findById(userId)

  console.log('user:', user, 'userId:', userId)

  const newGoal = new Goal({
    name,
    description,
    timeEnd,
    tries: [],
    start,
    end: false,
    todayDone: false,
    user: user._id
  })

  if (!name || !description || !timeEnd) {
    res.status(400).json({
      error: 'fields are required'
    })
  }

  try {
    const saveGoal = await newGoal.save()

    // user.goals.push(saveGoal._id)

    // await user.save()

    await User.updateOne(
      { _id: user._id },
      { $push: { goals: saveGoal._id } }
    )

    res.status(201).json({ message: 'Goal created', goal: saveGoal })
  } catch (e) {
    next(e)
  }
}

// get /api/goals
goalCtrl.getAllGoals = async (req, res) => {
  const goals = await Goal.find({ user: req.userId }).populate('user', {
    username: 1,
    email: 1
  })

  res.json(goals)
}

// get /api/goal/:id
goalCtrl.getSingleGoal = (req, res, next) => {
  Goal.findById(req.params.id)
    .then(goal => {
      res.json(goal)
    })
    .catch(e => next(e))
}

// patch /api/goal/:id
goalCtrl.wasDone = (req, res, next) => {
  const { todayDone } = req.body

  if (!todayDone) {
    return res.status(400).json({ message: 'Fields are required' })
  }

  Goal.findByIdAndUpdate(req.params.id, { todayDone })
    .then(() => {
      res.status(200).json({ message: 'Goal done' })
    })
    .catch(e => next(e))
}

// put /api/goal/:id
goalCtrl.abandonGoal = async (req, res, next) => {
  try {
    const { end, newTries } = req.body

    if (!end || !newTries) {
      return res.status(404).json({ message: 'Fields are required' })
    }
    const { tries } = await Goal.findById(req.params.id)

    tries.push(newTries)

    await Goal.findByIdAndUpdate(req.params.id, { end, tries })

    res
      .status(200)
      .json({ message: 'You have abandoned the goal', tries: tries, end: end })
  } catch (error) {
    next(error)
  }
}

// delete /api/goal/:id
goalCtrl.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id)

    if (goal === null) return res.sendStatus(404)

    res.status(204).json({ message: `The goal ${goal.name} was deleted` })
  } catch (error) {
    next(error)
  }
}

// patch /api/goal/resume/:id
goalCtrl.resumeGoal = (req, res, next) => {
  const { newStart, newEnd } = req.body

  if (!newStart || !newEnd) {
    return res.status(400).json({ message: 'Fields are required' })
  }

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
