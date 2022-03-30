const app = require('../server')
const supertest = require('supertest')
const User = require('../models/User')

const api = supertest(app)

const initialGoals = [
  {
    name: 'Learn React',
    description: 'Learn React',
    start: '2020-01-01',
    timeEnd: '2020-01-02',
    tries: [
      {
        start: '2020-01-01',
        end: '2020-01-02'
      }
    ],
    todayDone: false,
    end: false
  },
  {
    name: 'Learn Node',
    description: 'Learn Node',
    start: '2020-01-01',
    timeEnd: '2020-01-02',
    tries: [
      {
        start: '2020-01-01',
        end: '2020-01-02'
      }
    ],
    todayDone: false,
    end: false
  }
]

const getAlldescriptionsFromGoals = async () => {
  const response = await api
    .get('/api/goals')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  return {
    descriptions: response.body.map(goal => goal.description),
    response
  }
}

const getUsers = async () => {
  const userDB = await User.find({})
  return userDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialGoals,
  getAlldescriptionsFromGoals,
  getUsers
}
