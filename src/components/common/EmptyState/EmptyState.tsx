import { Inbox, type LucideIcon } from 'lucide-react'

export function EmptyState({
  message,
  icon: Icon = Inbox,
}: {
  message: string
  icon?: LucideIcon
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
      <Icon className="h-8 w-8" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
