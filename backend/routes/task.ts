import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { readTasksFile, writeTasksFile } from '../storage/tasks.ts'

type NewTask = {
  title: string
  date: number
}

type Task = NewTask & {
  id: string
  completed: boolean
}

export default async function taskRoutes(server: FastifyInstance) {
  const savedTasks: unknown = await readTasksFile()

    if (!Array.isArray(savedTasks)) {
    throw new Error('tasks.json must contain an array')
    }

    let tasks: Task[] = savedTasks
    let writeQueue = Promise.resolve()

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

    const save = writeQueue.then(async () => {
    const nextTasks = [...tasks, task]
    await writeTasksFile(nextTasks)
    tasks = nextTasks
    })

    writeQueue = save.catch(() => {})
    await save
    return reply.code(201).send(task)
  })
}