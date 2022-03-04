/* eslint-disable quotes */
"use strict"
const Goal = require("../models/Goal")

function reset () {
  Goal.find().then(goals => {
    goals.forEach(goal => {
      if (!goal.todayDone) {
        Goal.findByIdAndUpdate(goal._id, {
          $set: { todayDone: true, end: true },
          $push: { tries: { start: goal.start, end: new Date() } }
        }).catch(err => console.error(err))
      }
    })
  })
}

function launcher (hour, minutes, task) {
  const now = new Date()
  console.log("Launcher", now)
  let moment = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minutes
  )

  if (moment <= now) {
    moment = new Date(moment.getTime() + 1000 * 60 * 60 * 24)
  }

  console.log("To be run in", moment)

  setTimeout(() => {
    task()
    launcher(hour, minutes, task)
  }, moment.getTime() - now.getTime())
}

launcher(0, 10, reset)
