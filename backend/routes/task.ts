import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'

type NewTask = {
  title: string
  date: number
}

type Task = NewTask & {
  id: string
  completed: boolean
}

export default async function taskRoutes(server: FastifyInstance) {
  const tasks: Task[] = []

  server.get('/api/tasks', async () => {
    return tasks
  })

  server.post<{ Body: NewTask }>('/api/tasks', async (request, reply) => {
    const { title, date } = request.body ?? {}

    if (typeof title !== 'string' || title.trim() === '' || !Number.isSafeInteger(date)) {
      return reply.code(400).send({ error: 'A title and an integer date are required' })
    }

    const task: Task = {
      id: randomUUID(),
      title: title.trim(),
      date,
      completed: false,
    }

    tasks.push(task)
    return reply.code(201).send(task)
  })
}