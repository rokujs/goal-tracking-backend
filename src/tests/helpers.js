const app = require('../server')
const supertest = require('supertest')
const User = require('../models/User')

const api = supertest(app)

const initialGoals = [
  {
    name: 'Learn React',
    description: 'Learn React',
    start: '2020-01-01',
    timeEnd: '2020-01-02'
  },
  {
    name: 'Learn Node',
    description: 'Learn Node',
    start: '2020-01-01',
    timeEnd: '2020-01-02'
  }
]

const getAlldescriptionsFromGoals = async ({ token }) => {
  const response = await api
    .get('/api/goals')
    .set('Authorization', `Bearer ${token}`)
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
