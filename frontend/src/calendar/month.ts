export function getMonthLayout(year: number, month: number) {
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const leadingCount = (firstWeekday + 6) % 7
  const dayCount = new Date(year, month, 0).getDate()

  return { leadingCount, dayCount }
}