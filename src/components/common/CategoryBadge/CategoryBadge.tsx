import { cn } from '@/lib/utils'

const COLOR_BY_NAME: Record<string, string> = {
  'রাজনীতি': 'bg-red-600 text-white',
  'খেলা': 'bg-emerald-600 text-white',
  'বিশ্ব': 'bg-sky-600 text-white',
  'জাতীয়': 'bg-amber-600 text-white',
  'বিনোদন': 'bg-fuchsia-600 text-white',
  'বাণিজ্য': 'bg-indigo-600 text-white',
  'শিক্ষা': 'bg-teal-600 text-white',
  'সারাদেশ': 'bg-orange-600 text-white',
  'মতামত': 'bg-slate-700 text-white',
  'ভিডিও': 'bg-rose-600 text-white',
}

export function CategoryBadge({ name, className }: { name: string; className?: string }) {
  const colorClass = COLOR_BY_NAME[name] ?? 'bg-primary text-primary-foreground'
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded px-2 py-0.5 text-xs font-semibold',
        colorClass,
        className
      )}
    >
      {name}
    </span>
  )
}
