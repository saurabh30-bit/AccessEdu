'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Clock,
  LayoutDashboard,
  Mic,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: '/live',
    label: 'Live Lecture',
    icon: <Mic className="h-4 w-4" />,
  },
  {
    href: '/history',
    label: 'History',
    icon: <Clock className="h-4 w-4" />,
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all',
              active
                ? 'bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_10px_40px_rgba(79,70,229,0.20)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            )}
          >
            <span
              className={cn(
                'grid h-8 w-8 place-items-center rounded-lg transition-colors',
                active
                  ? 'bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-blue-400/20'
                  : 'bg-white/5 group-hover:bg-white/10'
              )}
            >
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

