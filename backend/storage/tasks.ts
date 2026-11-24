import { readFile } from 'node:fs/promises'

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