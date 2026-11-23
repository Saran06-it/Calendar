import { getMonthLayout } from './month'
import './Calendar.css'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Calendar() {
  const { leadingCount, dayCount } = getMonthLayout(2026, 11)
  const leadingCells = Array.from({ length: leadingCount })
  const days = Array.from({ length: dayCount }, (_, index) => index + 1)

  return (
    <div className="calendar-grid">
      {weekdays.map((day) => (
        <div key={day}>{day}</div>
      ))}

      {leadingCells.map((_, index) => (
        <div key={`empty-${index}`} aria-hidden="true" />
      ))}

      {days.map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  )
}