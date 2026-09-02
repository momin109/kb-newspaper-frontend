import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns'

const DIGITS_BN: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
}
const toBn = (n: number) => String(n).replace(/[0-9]/g, (d) => DIGITS_BN[d])

/**
 * Bangla relative-time string ("X দিন আগে" / "X ঘণ্টা আগে"), matching the
 * reference site's convention of never showing raw dates on cards.
 * Uses date-fns for the underlying diff calculations.
 */
export function formatBanglaRelativeTime(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()

  const minutes = differenceInMinutes(now, date)
  const hours = differenceInHours(now, date)
  const days = differenceInDays(now, date)

  if (minutes < 1) return 'এইমাত্র'
  if (minutes < 60) return `${toBn(minutes)} মিনিট আগে`
  if (hours < 24) return `${toBn(hours)} ঘণ্টা আগে`
  return `${toBn(days)} দিন আগে`
}
