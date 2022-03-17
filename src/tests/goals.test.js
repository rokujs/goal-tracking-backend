const mongoose = require('mongoose')

const server = require('../index')
const Goal = require('../models/Goal')
const { initialGoals, api, getAlldescriptionsFromGoals } = require('./helpers')

beforeEach(async () => {
  await Goal.deleteMany({})

  for (const goal of initialGoals) {
    const newGoal = new Goal(goal)
    await newGoal.save()
  }
})

describe('/api/goals', () => {
  test('Goals are returned as json', async () => {
    await api
      .get('/api/goals/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const response = await api.get('/api/goals/')
    expect(response.body).toHaveLength(initialGoals.length)
  })

  test('The first goal is about react', async () => {
    const response = await api.get('/api/goals/')
    expect(response.body[0].name).toBe('Learn React')
  })

  test('The goal content a description about react', async () => {
    const { descriptions } = await getAlldescriptionsFromGoals()
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
      .send(newGoal)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { response, descriptions } = await getAlldescriptionsFromGoals()

    expect(response.body).toHaveLength(initialGoals.length + 1)
    expect(descriptions).toContain(newGoal.description)
  })

  test('Goal without description is not added', async () => {
    const newGoal = {
      name: 'test',
      timeEnd: '2021-08-02',
      start: '2022-5-13'
    }

    await api.post('/api/goals/add').send(newGoal).expect(400)

    const { response } = await getAlldescriptionsFromGoals()

    expect(response.body).toHaveLength(initialGoals.length)
  })
})

describe('GET /api/goal/:id', () => {
  test('A valid goal can be returned', async () => {
    const { response } = await getAlldescriptionsFromGoals()

    const goal = response.body[0]

    const resGoal = await api
      .get(`/api/goal/${goal.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resGoal.body.name).toContain(initialGoals[0].name)
  })

  test('A goal that do not exist can not be returned', async () => {
    await api.get('/api/goal/1234').expect(400)
  })
})

describe('PUT /api/goal/:id', () => {
  test('A valid goal can be abandon', async () => {
    const { response } = await getAlldescriptionsFromGoals()

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
      .send(infoGoal)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals()

    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(resGoal.body.end).toBe(true)
    expect(secondResponse.body[0].end).toBe(true)
  })

  test('A goal without tries cannot be abandon', async () => {
    const { response } = await getAlldescriptionsFromGoals()

    const abandonGoal = response.body[0]
    const infoGoal = {
      end: true
    }

    await api
      .put(`/api/goal/${abandonGoal.id}`)
      .send(infoGoal)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals()

    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(secondResponse.body[0].end).toBe(false)
  })
})

describe('PATCH /api/goal/:id', () => {
  test('A valid goal can be done', async () => {
    const { response } = await getAlldescriptionsFromGoals()

    const goalDone = response.body[0]
    const wasDone = {
      todayDone: true
    }

    const resGoal = await api
      .patch(`/api/goal/${goalDone.id}`)
      .send(wasDone)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals()

    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(resGoal.body.message).toBe('Goal done')
    expect(secondResponse.body[0].todayDone).toBe(true)
  })

  test('A goal without todayDone cannot be done', async () => {
    const { response } = await getAlldescriptionsFromGoals()

    const goalDone = response.body[0]

    await api
      .patch(`/api/goal/${goalDone.id}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals()

    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(secondResponse.body[0].todayDone).toBe(false)
  })
})

describe('DELETE /api/goal/:id', () => {
  test('A goal can be deleted', async () => {
    const { response: firstResponse } = await getAlldescriptionsFromGoals()
    const goalToDelete = firstResponse.body[0]

    await api.delete(`/api/goal/${goalToDelete.id}`).expect(204)

    const { descriptions, response: secondResponse } =
      await getAlldescriptionsFromGoals()

    expect(secondResponse.body).toHaveLength(initialGoals.length - 1)
    expect(descriptions).not.toContain(goalToDelete.description)
  })

  test('A goal that do not exist can not be deleted', async () => {
    await api.delete('/api/goal/124').expect(400)

    const { response } = await getAlldescriptionsFromGoals()

    expect(response.body).toHaveLength(initialGoals.length)
  })
})

describe('PATCH /api/goal/resume/:id', () => {
  beforeEach(async () => {
    await Goal.deleteMany({})

    for (const goal of initialGoals) {
      goal.todayDone = true
      goal.end = true
      const newGoal = new Goal(goal)
      await newGoal.save()
    }
  })
  test('A valid goal can be changed to resume', async () => {
    const { response } = await getAlldescriptionsFromGoals()

    const goalResume = response.body[0]
    const resume = {
      newStart: new Date(),
      newEnd: new Date()
    }

    const resGoal = await api
      .patch(`/api/goal/resume/${goalResume.id}`)
      .send(resume)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals()

    expect(resGoal.body.message).toBe('Goal resumed')
    expect(secondResponse.body).toHaveLength(initialGoals.length)
    expect(secondResponse.body[0].todayDone).toBe(false)
    expect(secondResponse.body[0].end).toBe(false)
  })

  test('A goal without news dates cannot be changed to resume', async () => {
    const { response } = await getAlldescriptionsFromGoals()

    const goalResume = response.body[0]

    const resGoal = await api
      .patch(`/api/goal/resume/${goalResume.id}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { response: secondResponse } = await getAlldescriptionsFromGoals()

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
