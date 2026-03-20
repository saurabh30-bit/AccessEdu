'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface HistoryItem {
  id: string
  title: string
  date: string
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/history`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <header className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-zinc-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-white">History</h1>
      </header>

      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        {loading ? (
          <div className="grid gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-400 bg-red-500/10 rounded-lg p-4">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">No lectures yet</p>
        ) : (
          <div className="grid gap-3 sm:gap-4 max-w-2xl">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-200 truncate">{item.title}</p>
                  <p className="text-sm text-zinc-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
