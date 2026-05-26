'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/app-shell';
import {
  bookings as allBookings,
  centers,
} from '@/lib/mock-data';
import { Booking, BookingStatus, PlanType } from '@/types';

const bookingStatusColors: Record<BookingStatus, string> = {
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const plans: { value: PlanType; label: string }[] = [
  { value: 'hot-desk', label: 'Hot Desk' },
  { value: 'dedicated', label: 'Dedicated Desk' },
  { value: 'cabin', label: 'Private Cabin' },
  { value: 'meeting-room', label: 'Meeting Room' },
];

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Plus,
  CalendarCheck,
  Eye,
  Edit3,
  Armchair,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function formatFullCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

// ─── Calendar helpers ────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(allBookings);
  const [activeTab, setActiveTab] = useState('all');
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4); // May = 4 (0-indexed)

  // Stats
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.amount, 0);

  function handleAddBooking(newBooking: Omit<Booking, 'id' | 'createdAt' | 'status'>) {
    const booking: Booking = {
      ...newBooking,
      id: `bk-${String(bookings.length + 1).padStart(3, '0')}`,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBookings((prev) => [booking, ...prev]);
  }

  const stats = [
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: CalendarCheck,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Active',
      value: activeBookings,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Pending',
      value: pendingBookings,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
    },
    {
      label: 'Revenue',
      value: formatFullCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  // Calendar bookings lookup
  const calendarBookings = useMemo(() => {
    const map: Record<string, { booking: Booking; color: string }[]> = {};
    const statusDotColor: Record<BookingStatus, string> = {
      confirmed: 'bg-emerald-400',
      pending: 'bg-yellow-400',
      cancelled: 'bg-red-400',
    };
    bookings.forEach((b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      // Only show dots for days within the calendar month
      const monthStart = new Date(calYear, calMonth, 1);
      const monthEnd = new Date(calYear, calMonth + 1, 0);
      const rangeStart = start < monthStart ? monthStart : start;
      const rangeEnd = end > monthEnd ? monthEnd : end;
      for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
        const key = d.getDate().toString();
        if (!map[key]) map[key] = [];
        if (map[key].length < 3) {
          map[key].push({ booking: b, color: statusDotColor[b.status] });
        }
      }
    });
    return map;
  }, [bookings, calYear, calMonth]);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;

  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Bookings</h1>
            <p className="mt-1 text-sm text-slate-400">
              Track and manage all workspace bookings across centers
            </p>
          </div>
          <Dialog open={newBookingOpen} onOpenChange={setNewBookingOpen}>
            <DialogTrigger
              render={
                <Button className="bg-indigo-600 text-white hover:bg-indigo-500 gap-2 h-9 px-4">
                  <Plus className="h-4 w-4" />
                  New Booking
                </Button>
              }
            />
            <NewBookingDialog onClose={() => setNewBookingOpen(false)} onAdd={handleAddBooking} />
          </Dialog>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-4 transition-colors',
                stat.bg
              )}
            >
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/60')}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                <p className={cn('text-xl font-bold', stat.color)}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-900 border border-slate-800/60">
            <TabsTrigger
              value="all"
              className="data-active:bg-indigo-600 data-active:text-white text-slate-400"
            >
              <CalendarCheck className="mr-1.5 h-3.5 w-3.5" />
              All Bookings
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-active:bg-indigo-600 data-active:text-white text-slate-400"
            >
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          {/* All Bookings Tab */}
          <TabsContent value="all">
            <div className="mt-4 rounded-xl border border-slate-800/60 bg-slate-900/30">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/40 hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs font-semibold">Booking ID</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold">Client</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold">Center</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold">Seat</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold">Plan</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold">Start Date</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold">End Date</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-indigo-400 font-medium">
                        {booking.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{booking.clientName}</p>
                          <p className="text-xs text-slate-500">{booking.clientName.toLowerCase().replace(/\s+/g, '.') + '@company.com'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs">{booking.centerName}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{booking.seatNumber}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md border border-slate-700/50 bg-slate-800/40 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                          {booking.plan}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs">{booking.startDate}</TableCell>
                      <TableCell className="text-slate-400 text-xs">{booking.endDate}</TableCell>
                      <TableCell className="text-right font-medium text-slate-200">
                        {formatFullCurrency(booking.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize',
                            bookingStatusColors[booking.status]
                          )}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <Armchair className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Calendar View Tab */}
          <TabsContent value="calendar">
            <div className="mt-4 rounded-xl border border-slate-800/60 bg-slate-900/30 p-4">
              {/* Calendar header */}
              <div className="mb-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={prevMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-base font-semibold text-white">
                  {MONTH_NAMES[calMonth]} {calYear}
                </h3>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={nextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-px">
                {DAY_NAMES.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-xs font-semibold text-slate-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-px">
                {/* Empty cells for days before the first day of the month */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="min-h-[80px] rounded-lg border border-transparent bg-slate-900/30 p-1.5"
                  />
                ))}
                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayStr = day.toString();
                  const dayBookings = calendarBookings[dayStr] || [];
                  const isToday = isCurrentMonth && day === today.getDate();
                  return (
                    <div
                      key={day}
                      className={cn(
                        'min-h-[80px] rounded-lg border p-1.5 transition-colors hover:border-slate-700/60 hover:bg-slate-800/30',
                        isToday
                          ? 'border-indigo-500/40 bg-indigo-500/5'
                          : 'border-slate-800/30 bg-slate-900/20'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                          isToday
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400'
                        )}
                      >
                        {day}
                      </span>
                      {dayBookings.length > 0 && (
                        <div className="mt-1 flex flex-col gap-0.5">
                          {dayBookings.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-slate-800/60"
                            >
                              <div className={cn('h-1.5 w-1.5 shrink-0 rounded-full', item.color)} />
                              <span className="truncate text-[10px] text-slate-400">
                                {item.booking.clientName.split(' ')[0]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 border-t border-slate-800/40 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-500">Confirmed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="text-xs text-slate-500">Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="text-xs text-slate-500">Cancelled</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

/* ── New Booking Dialog ───────────────────────────────────────────── */
function NewBookingDialog({ onClose, onAdd }: { onClose: () => void; onAdd: (booking: any) => void }) {
  const clientNames = [
    'Arjun Mehta',
    'Priya Sharma',
    'Rahul Verma',
    'Sneha Reddy',
    'Vikram Singh',
    'Ananya Iyer',
    'Meera Joshi',
    'Rohit Bansal',
    'Deepika Nair',
    'Pooja Tiwari',
  ];

  const [clientName, setClientName] = useState(clientNames[0]);
  const [centerName, setCenterName] = useState(centers[0].name);
  const [plan, setPlan] = useState<PlanType>('hot-desk');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-12-01');
  const [amount, setAmount] = useState('45000');

  function handleSubmit() {
    onAdd({
      clientId: `cli-${String(Math.floor(Math.random() * 100) + 10).padStart(3, '0')}`,
      clientName,
      centerId: centers.find((c) => c.name === centerName)?.id || 'ctr-001',
      centerName,
      seatId: `seat-${String(Math.floor(Math.random() * 80) + 1).padStart(3, '0')}`,
      seatNumber: `${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${String(Math.floor(Math.random() * 15) + 1).padStart(2, '0')}`,
      plan,
      startDate,
      endDate,
      amount: parseFloat(amount) || 0,
    });
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700/60 text-slate-200">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-indigo-400" />
          New Booking
        </DialogTitle>
        <DialogDescription className="text-slate-400">
          Create a new workspace booking for a client.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Client</label>
            <Select value={clientName} onValueChange={(val) => setClientName(val || '')}>
              <SelectTrigger className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-300 w-full">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {clientNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Center</label>
            <Select value={centerName} onValueChange={(val) => setCenterName(val || '')}>
              <SelectTrigger className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-300 w-full">
                <SelectValue placeholder="Select center" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {centers.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Plan</label>
          <Select value={plan} onValueChange={(val) => setPlan((val as PlanType) || 'hot-desk')}>
            <SelectTrigger className="h-9 w-full border-slate-700/60 bg-slate-800/50 text-sm text-slate-300">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {plans.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-200"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Amount (₹)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 150000"
            className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-200 placeholder:text-slate-600"
          />
        </div>
      </div>
      <DialogFooter className="border-slate-800/60 bg-slate-900/80">
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="bg-indigo-600 text-white hover:bg-indigo-500"
          onClick={handleSubmit}
        >
          Create Booking
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
