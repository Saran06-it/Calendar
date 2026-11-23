import { getMonthLayout } from './month'
import './Calendar.css'
import { useState } from 'react'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
            {days.map((day) => (
            <button
                key={day}
                type="button"
                onClick={() => setSelectedDate(new Date(year, monthIndex, day))}
            >
                {day}
            </button>
            ))}
        </div>
        <p>
        {selectedDate
            ? `Selected: ${selectedDate.toLocaleDateString('en-GB')}`
            : 'Select a date'}
        </p>
    </section>
  )
}

