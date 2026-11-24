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

  function enqueueWrite<T>(write: () => Promise<T>) {
    const result = writeQueue.then(write)
    writeQueue = result.then(() => {}, () => {})
    return result
  }

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

    await enqueueWrite(async () => {
      const nextTasks = [...tasks, task]
      await writeTasksFile(nextTasks)
      tasks = nextTasks
    })

    return reply.code(201).send(task)
  })

  server.patch<{
    Params: { id: string }
    Body: { title?: string; completed?: boolean }
  }>('/api/tasks/:id', async (request, reply) => {
    const { id } = request.params
    const { title, completed } = request.body ?? {}

    if (
      (title === undefined && completed === undefined) ||
      (title !== undefined && (typeof title !== 'string' || title.trim() === '')) ||
      (completed !== undefined && typeof completed !== 'boolean')
    ) {
      return reply.code(400).send({ error: 'Provide a valid title or completed status' })
    }

    const updated = await enqueueWrite(async () => {
      const task = tasks.find((item) => item.id === id)

      if (!task) return undefined

      const updatedTask: Task = {
        ...task,
        title: title?.trim() ?? task.title,
        completed: completed ?? task.completed,
      }

      const nextTasks = tasks.map((item) => (item.id === id ? updatedTask : item))
      await writeTasksFile(nextTasks)
      tasks = nextTasks
      return updatedTask
    })

    if (!updated) {
      return reply.code(404).send({ error: 'Task not found' })
    }

    return reply.code(200).send(updated)
  })
  
  server.delete<{ Params: { id: string } }>('/api/tasks/:id', async (request, reply) => {
  const { id } = request.params

  const deleted = await enqueueWrite(async () => {
    const nextTasks = tasks.filter((task) => task.id !== id)

    if (nextTasks.length === tasks.length) return false

    await writeTasksFile(nextTasks)
    tasks = nextTasks
    return true
  })

  if (!deleted) {
    return reply.code(404).send({ error: 'Task not found' })
  }

  return reply.code(204).send()
})

}
