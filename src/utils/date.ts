const DAY_MS = 24 * 60 * 60 * 1000

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1, 12)
}

export function getTodayDate(): string {
  return toDateString(new Date())
}

export function addDays(dateString: string, amount: number): string {
  const nextDate = parseDateString(dateString)
  nextDate.setDate(nextDate.getDate() + amount)
  return toDateString(nextDate)
}

export function differenceInDays(from: string, to: string): number {
  const fromTime = parseDateString(from).getTime()
  const toTime = parseDateString(to).getTime()
  return Math.round((toTime - fromTime) / DAY_MS)
}

export function compareDateStrings(left: string, right: string): number {
  return parseDateString(left).getTime() - parseDateString(right).getTime()
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

export function formatShortDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(parseDateString(dateString))
}

export function formatLongDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parseDateString(dateString))
}

export function formatWeekRange(startDate: string, endDate: string): string {
  return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`
}
