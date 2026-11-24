import Fastify from 'fastify'
import taskRoutes from './routes/task.ts'

const server = Fastify({ logger: true })

server.get('/health', async () => {
  return { status: 'ok' }
})

await server.register(taskRoutes)

await server.listen({ host: '127.0.0.1', port: 3000 })