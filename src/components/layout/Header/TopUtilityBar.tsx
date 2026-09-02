import { BreakingTicker } from '@/features/breaking-news/components/BreakingTicker'

const WEEKDAYS_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
const MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
]
const DIGITS_BN: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
}
const toBn = (n: number) => String(n).replace(/[0-9]/g, (d) => DIGITS_BN[d])

/** Server Component — date is computed at request time on the server. */
export function TopUtilityBar() {
  const today = new Date()
  const dateLabel = `${toBn(today.getDate())} ${MONTHS_BN[today.getMonth()]} ${toBn(today.getFullYear())}`
  const dayLabel = WEEKDAYS_BN[today.getDay()]

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 sm:px-4">
        <BreakingTicker />
        <span className="hidden shrink-0 whitespace-nowrap py-2 text-xs font-medium sm:block">
          {dateLabel} &nbsp; {dayLabel}
        </span>
      </div>
    </div>
  )
}
