import { Apple, Smartphone } from 'lucide-react'

export function AppDownloadBadge({ platform }: { platform: 'ios' | 'android' }) {
  const isIos = platform === 'ios'
  return (
    <a
      href="#"
      className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 hover:bg-accent"
    >
      {isIos ? <Apple className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
      <span className="text-left leading-tight">
        <span className="block text-[10px] text-muted-foreground">ডাউনলোড করুন</span>
        <span className="block text-xs font-semibold">{isIos ? 'আইফোন' : 'অ্যান্ড্রয়েড'}</span>
      </span>
    </a>
  )
}
