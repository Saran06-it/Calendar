import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'

const tasksFile = new URL('../data/tasks.json', import.meta.url)

export async function readTasksFile() {
  try {
    const text = await readFile(tasksFile, 'utf8')
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}
export async function writeTasksFile(tasks: unknown[]) {
  const dataDirectory = new URL('./', tasksFile)
  const temporaryFile = new URL('tasks.json.tmp', dataDirectory)

  await mkdir(dataDirectory, { recursive: true })

  const text = JSON.stringify(tasks, null, 2)
  await writeFile(temporaryFile, text, 'utf8')
  await rename(temporaryFile, tasksFile)
}