const mongoose = require('mongoose')

const server = require('../index')
const Goal = require('../models/Goal')
const User = require('../models/User')

const { initialGoals, api, getAlldescriptionsFromGoals } = require('./helpers')

let token = ''

beforeEach(async () => {
  await Goal.deleteMany({})
  await User.deleteMany({})

  const user = {
    username: 'test',
    email: 'test@test.com',
    password: 'test'
  }

  const res = await api.post('/api/user').send(user)

  token = res.body.token

  for (const goal of initialGoals) {
    await api
      .post('/api/goals/add')
      .set('Authorization', `Bearer ${token}`)
      .send(goal)
  }
})

describe('/api/goals', () => {
  test('Goals are returned as json', async () => {
    await api
      .get('/api/goals/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const response = await api
      .get('/api/goals/')
      .set('Authorization', `Bearer ${token}`)
    expect(response.body).toHaveLength(initialGoals.length)
  })

  test('The first goal is about react', async () => {
    const response = await api
      .get('/api/goals/')
      .set('Authorization', `Bearer ${token}`)
    expect(response.body[0].name).toBe('Learn React')
  })

  test('The goal content a description about react', async () => {
    const { descriptions } = await getAlldescriptionsFromGoals({ token })
    expect(descriptions).toContain('Learn React')
  })
})

describe('/api/goals/add', () => {
  test('A valid goal can be added', async () => {
    const newGoal = {
      name: 'test',
      description: 'una descripcion',
      timeEnd: '2021-08-02',
      start: '2022-5-13'
    }

    await api
      .post('/api/goals/add')
      .set('Authorization', `Bearer ${token}`)
      .send(newGoal)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { response, descriptions } = await getAlldescriptionsFromGoals({
      token
    })

    expect(response.body).toHaveLength(initialGoals.length + 1)
    expect(descriptions).toContain(newGoal.description)
  })

  test('Goal without description is not added', async () => {
    const newGoal = {
      name: 'test',
      timeEnd: '2021-08-02',
      start: '2022-5-13'
    }

    await api
      .post('/api/goals/add')
      .set('Authorization', `Bearer ${token}`)
      .send(newGoal)
      .expect(400)

    const { response } = await getAlldescriptionsFromGoals({ token })

    expect(response.body).toHaveLength(initialGoals.length)
  })
})

describe('GET /api/goal/:id', () => {
  test('A valid goal can be returned', async () => {
    const { response } = await getAlldescriptionsFromGoals({ token })

    const goal = response.body[0]

    const resGoal = await api
      .get(`/api/goal/${goal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resGoal.body.name).toContain(initialGoals[0].name)
  })

  test('A goal that do not exist can not be returned', async () => {
    await api
      .get('/api/goal/1234')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})

describe('PUT /api/goal/:id', () => {
  test('A valid goal can be abandon', async () => {
    const { response } = await getAlldescriptionsFromGoals({ token })

    const abandonGoal = response.body[0]
    const infoGoal = {
      end: true,
      newTries: {
        start: '2020-01-01',
        end: '2020-01-02'
      }
    }

    const resGoal = await api
      .put(`/api/goal/${abandonGoal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(infoGoal)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals({
      token
    })

    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(resGoal.body.end).toBe(true)
    expect(secondResponse.body[0].end).toBe(true)
  })

  test('A goal without tries cannot be abandon', async () => {
    const { response } = await getAlldescriptionsFromGoals({ token })

    const abandonGoal = response.body[0]
    const infoGoal = {
      end: true
    }

    await api
      .put(`/api/goal/${abandonGoal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(infoGoal)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals({
      token
    })

    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(secondResponse.body[0].end).toBe(false)
  })
})

describe('PATCH /api/goal/:id', () => {
  test('A valid goal can be done', async () => {
    const { response } = await getAlldescriptionsFromGoals({ token })

    const goalDone = response.body[0]
    const wasDone = {
      todayDone: true
    }

    const resGoal = await api
      .patch(`/api/goal/${goalDone.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(wasDone)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals({
      token
    })

    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(resGoal.body.message).toBe('Goal done')
    expect(secondResponse.body[0].todayDone).toBe(true)
  })

  test('A goal without todayDone cannot be done', async () => {
    const { response } = await getAlldescriptionsFromGoals({ token })

    const goalDone = response.body[0]

    await api
      .patch(`/api/goal/${goalDone.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals({
      token
    })

    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(secondResponse.body[0].todayDone).toBe(false)
  })
})

describe('DELETE /api/goal/:id', () => {
  test('A goal can be deleted', async () => {
    const { response: firstResponse } = await getAlldescriptionsFromGoals({
      token
    })
    const goalToDelete = firstResponse.body[0]

    await api
      .delete(`/api/goal/${goalToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const { descriptions, response: secondResponse } =
      await getAlldescriptionsFromGoals({ token })

    expect(secondResponse.body).toHaveLength(initialGoals.length - 1)
    expect(descriptions).not.toContain(goalToDelete.description)
  })

  test('A goal that do not exist can not be deleted', async () => {
    await api
      .delete('/api/goal/124')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const { response } = await getAlldescriptionsFromGoals({ token })

    expect(response.body).toHaveLength(initialGoals.length)
  })
})

describe('PATCH /api/goal/resume/:id', () => {
  beforeEach(async () => {
    await Goal.deleteMany({})
    await User.deleteMany({})

    const user = {
      username: 'test',
      email: 'test@test.com',
      password: 'test'
    }
    const wasDone = {
      todayDone: true
    }
    const infoGoal = {
      end: true,
      newTries: {
        start: '2020-01-01',
        end: '2020-01-02'
      }
    }

    const res = await api.post('/api/user').send(user)

    token = res.body.token

    for (const goal of initialGoals) {
      const response = await api
        .post('/api/goals/add')
        .set('Authorization', `Bearer ${token}`)
        .send(goal)

      const id = response.body.goal.id

      await api
        .patch(`/api/goal/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(wasDone)

      await api
        .put(`/api/goal/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(infoGoal)
    }
  })

  test('A valid goal can be changed to resume', async () => {
    const { response } = await getAlldescriptionsFromGoals({ token })

    const goalResume = response.body[0]
    const resume = {
      newStart: new Date(),
      newEnd: new Date()
    }

    const resGoal = await api
      .patch(`/api/goal/resume/${goalResume.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(resume)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals({
      token
    })

    expect(resGoal.body.message).toBe('Goal resumed')
    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(secondResponse.body[0].todayDone).toBe(false)
    expect(secondResponse.body[0].end).toBe(false)
  })

  test('A goal without news dates cannot be changed to resume', async () => {
    const { response } = await getAlldescriptionsFromGoals({ token })

    const goalResume = response.body[0]

    const resGoal = await api
      .patch(`/api/goal/resume/${goalResume.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals({
      token
    })

    console.log('responseSecond', secondResponse.body)
    console.log('resGoal', resGoal.body)

    expect(resGoal.body.message).toBe('Fields are required')
    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(secondResponse.body[0].todayDone).toBe(true)
    expect(secondResponse.body[0].end).toBe(true)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
