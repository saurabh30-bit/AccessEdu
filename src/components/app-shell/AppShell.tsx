'use client';

import React, { useMemo, useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/app-shell/PageTransition';
import SidebarNav from '@/components/app-shell/SidebarNav';

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = useMemo(() => <SidebarNav />, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.18]" />
        <div className="absolute -left-24 top-0 h-[420px] w-[520px] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-28 top-10 h-[480px] w-[560px] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/2 h-[380px] w-[560px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex h-full flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-6 py-5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/25 to-blue-500/25 ring-1 ring-white/10">
              <Sparkles className="h-5 w-5 text-indigo-200" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">
                AccessEdu
              </div>
              <div className="text-xs text-slate-300/80">
                AI Classroom Equalizer
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="h-px bg-white/10" />
          </div>

          <div className="px-6 pb-6">{nav}</div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-2 py-1 text-white/90"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/35 via-purple-500/25 to-blue-500/25 ring-1 ring-white/10">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">AccessEdu</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 transition hover:bg-white/10"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          />
          <div className="absolute left-3 right-3 top-16 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
            <div className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-300/70">
              Navigate
            </div>
            {nav}
          </div>
        </div>
      ) : null}

      {/* Main */}
      <div className="relative z-10 lg:pl-72">
        <main className="min-h-screen px-4 pb-16 pt-20 lg:pt-10 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}

