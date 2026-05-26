'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Building2,
  CreditCard,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Zap,
  Armchair,
  CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/seats', label: 'Seats', icon: Armchair },
  { href: '/renewals', label: 'Renewals', icon: CalendarClock },
  { href: '/billing', label: 'Billing', icon: CreditCard },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/60 bg-slate-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-800/60 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-white">Nex</span>
            <span className="text-cyan-400">Desk</span>
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto lg:hidden text-slate-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 shadow-sm shadow-indigo-500/5'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <item.icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0',
                    isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div className="border-t border-slate-800/60 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs text-white">
                NR
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">Nishitha Reddy</p>
              <p className="text-xs text-slate-500 truncate">Admin</p>
            </div>
            <Button variant="ghost" size="icon-xs" className="text-slate-500 hover:text-slate-300">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-800/60 bg-slate-950/80 px-4 backdrop-blur-xl lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative hidden flex-1 max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search leads, bookings, centers..."
              className="h-9 w-full rounded-lg border-slate-800 bg-slate-900/80 pl-9 text-sm text-slate-300 placeholder:text-slate-600 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-400 hover:text-slate-200"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
            </Button>

            {/* Profile */}
            <div className="hidden items-center gap-2 rounded-lg border border-slate-800/60 bg-slate-900/50 px-3 py-1.5 lg:flex">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-cyan-500 text-[10px] text-white">
                  NR
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-slate-300">Nishitha</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
