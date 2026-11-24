import { getMonthLayout } from './month'
import './Calendar.css'
import { useState } from 'react'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
type Task = {
  id: string
  title: string
  date: number
  completed: boolean
}
export default function Calendar() {
  

  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2026, 10, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const year = visibleMonth.getFullYear()
  const monthIndex = visibleMonth.getMonth()
  const { leadingCount, dayCount } = getMonthLayout(year, monthIndex + 1)
  const leadingCells = Array.from({ length: leadingCount })
  const days = Array.from({ length: dayCount }, (_, index) => index + 1)
  function changeMonth(offset: number) {
    setVisibleMonth((current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    )
}
    const [tasks, setTasks] = useState<Task[]>([])
    const [taskTitle, setTaskTitle] = useState('')

    const selectedDay = selectedDate?.getTime()
    const tasksForSelectedDay = tasks.filter((task) => task.date === selectedDay)

    function addTask() {
        const title = taskTitle.trim()
        if (selectedDay === undefined || title === '') return
        const task: Task = {
            id: crypto.randomUUID(),
            title,
            date: selectedDay,
            completed: false,
        }
        setTasks((currentTasks) => [...currentTasks, task])
        setTaskTitle('')
    }
    function toggleTask(id: string) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
            ),
        )
    }
    function deleteTask(id: string) {
    const confirmed = window.confirm('Delete this task?')

    if (!confirmed) return

    setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id),
    )
    }
    function editTask(task: Task) {

        const input = window.prompt('Edit task name', task.title)
        if (input === null) return
        const title = input.trim()
        if (title === '') return
        setTasks((currentTasks) =>
            currentTasks.map((item) =>
            item.id === task.id ? { ...item, title } : item,
            ),
        )
    }
  return (

    <section>
        <header>
            <button type="button" onClick={() => changeMonth(-1)}>
                Previous month
            </button>
            <h2>
                {visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button type="button" onClick={() => changeMonth(1)}>
                Next month
            </button>
        </header>
        <div className="calendar-grid">
            {weekdays.map((day) => (
                <div key={day}>{day}</div>
            ))}

            {leadingCells.map((_, index) => (
                <div key={`empty-${index}`} aria-hidden="true" />
            ))}
            {days.map((day) => {
            const isSelected =
                selectedDate !== null &&
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === monthIndex &&
                selectedDate.getDate() === day

            return (
                <button
                key={day}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedDate(new Date(year, monthIndex, day))}
                >
                {day}
                </button>
            )
            })}
        </div>
        <p>
        {selectedDate
            ? `Selected: ${selectedDate.toLocaleDateString('en-GB')}`
            : 'Select a date'}
        </p>
        {selectedDate && (
        <form
            onSubmit={(event) => {
            event.preventDefault()
            addTask()
            }}
        >
            <label>
            Task name
            <input
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
            />
            </label>
            <button type="submit">Add task</button>
        </form>
        )}

        <ul>
        {tasksForSelectedDay.map((task) => (
            <li key={task.id}>
            <label>
                <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                />
                {task.title}
            </label>
            <button type="button" onClick={() => deleteTask(task.id)}>
                Delete
            </button>
            <button type="button" onClick={() => editTask(task)}>
                Edit
            </button>
            </li>
        ))}
        </ul>
    </section>
  )
}

