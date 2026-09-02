'use client'

import { Printer, Link2, Users, Video, AtSign, Send } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Social share row (Facebook/Messenger/WhatsApp/X icons are generic —
 * see the earlier note on lucide-react dropping brand marks), copy-link,
 * and print. `url`/`title` are used to build share intents.
 */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const shareLinks = [
    {
      icon: Users,
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      icon: Send,
      label: 'Messenger',
      href: `https://www.messenger.com/share?link=${encodeURIComponent(url)}`,
    },
    {
      icon: Video,
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    },
    {
      icon: AtSign,
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('লিংক কপি হয়েছে')
    } catch {
      toast.error('কপি করা যায়নি')
    }
  }

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="লিংক কপি করুন"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
      >
        <Link2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => window.print()}
        aria-label="প্রিন্ট করুন"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
      >
        <Printer className="h-4 w-4" />
      </button>
    </div>
  )
}
