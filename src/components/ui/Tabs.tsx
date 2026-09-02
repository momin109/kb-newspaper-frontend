'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  setValue: (v: string) => void
}
const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs.* must be used within <Tabs>')
  return ctx
}

interface TabsProps {
  value: string
  onValueChange: (v: string) => void
  children: ReactNode
  className?: string
}

/** Minimal, dependency-free Tabs (no Radix) — controlled from outside via value/onValueChange. */
export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('inline-flex h-9 items-center gap-4 border-b border-border', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const { value: active, setValue } = useTabsContext()
  const isActive = active === value
  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        'flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-1 pb-2 text-sm font-semibold text-muted-foreground transition-colors',
        isActive && 'border-primary text-primary'
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const { value: active } = useTabsContext()
  if (active !== value) return null
  return <div className="mt-3">{children}</div>
}
