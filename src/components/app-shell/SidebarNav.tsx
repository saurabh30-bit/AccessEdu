"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mic, History, Sparkles, Settings, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getGeminiKey } from '@/lib/storage';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Live Lecture', href: '/live', icon: Mic },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [hasApiKey, setHasApiKey] = React.useState(false);

  React.useEffect(() => {
    // Check for API key periodically or on navigation
    setHasApiKey(!!getGeminiKey());
  }, [pathname]);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 z-50 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">AccessEdu</span>
        </Link>
      </div>

      <nav className="px-4 mt-6 space-y-2 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-card p-4 border-white/5 bg-white/2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Circle className={cn(
                "w-3 h-3 fill-current",
                hasApiKey ? "text-green-500" : "text-zinc-600"
              )} />
              {hasApiKey && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-none mb-1">
                API Status
              </p>
              <p className="text-xs font-medium text-zinc-300 truncate">
                {hasApiKey ? "Gemini Connected" : "API Not Configured"}
              </p>
            </div>
          </div>
          {!hasApiKey && (
            <Link 
              href="/settings"
              className="mt-3 block text-center text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Configure Now →
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
