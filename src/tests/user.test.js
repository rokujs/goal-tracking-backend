const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const server = require('../index')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

describe('Creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      username: 'test',
      passwordHash,
      email: 'roku@js.me'
    })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'newUser',
      password: 'roku',
      email: 'user@mail.com'
    }

    await api
      .post('/api/user')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await getUsers()

    const usernames = userAtEnd.map(user => user.username)

    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usernames).toContain(newUser.username)
  })

  test('Creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'test',
      passwordHash: 'pswd',
      email: 'me@js.me'
    }

    const result = await api
      .post('/api/user')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const userAtEnd = await getUsers()
    expect(userAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
