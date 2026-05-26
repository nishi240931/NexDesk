'use client';

import * as React from 'react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
  RefreshCw,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
type RenewalStatus = 'upcoming' | 'due' | 'renewed' | 'expired';

interface Renewal {
  id: string;
  client: string;
  center: string;
  plan: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: RenewalStatus;
  daysUntilExpiry: number;
}

// --- Mock Data ---
const clientData = [
  { name: 'TechVista Solutions', center: 'Koramangala Hub', plan: 'Team Suite (6 pax) — Monthly', amount: 72000 },
  { name: 'GreenLeaf Analytics', center: 'Indiranagar Hive', plan: 'Dedicated Desk — Monthly', amount: 12000 },
  { name: 'Pinnacle Designs', center: 'HSR Nexus', plan: 'Private Cabin — Quarterly', amount: 45000 },
  { name: 'CloudNine Innovations', center: 'Koramangala Hub', plan: 'Hot Desk — Monthly', amount: 8500 },
  { name: 'Quantum Labs', center: 'Indiranagar Hive', plan: 'Team Suite (4 pax) — Monthly', amount: 52000 },
  { name: 'SilverLine Media', center: 'HSR Nexus', plan: 'Virtual Office — Annual', amount: 36000 },
  { name: 'Infra Dynamics Pvt Ltd', center: 'Koramangala Hub', plan: 'Private Cabin — Monthly', amount: 18000 },
  { name: 'NovaBridge Consulting', center: 'Indiranagar Hive', plan: 'Dedicated Desk — Monthly', amount: 12000 },
  { name: 'AuraStack Technologies', center: 'HSR Nexus', plan: 'Team Suite (8 pax) — Quarterly', amount: 180000 },
  { name: 'MintRoute Logistics', center: 'Koramangala Hub', plan: 'Hot Desk — Monthly', amount: 8500 },
  { name: 'CrestView Capital', center: 'Indiranagar Hive', plan: 'Private Cabin — Monthly', amount: 19500 },
  { name: 'Pixel Forge Studio', center: 'HSR Nexus', plan: 'Dedicated Desk — Monthly', amount: 11000 },
  { name: 'Horizon Data Systems', center: 'Koramangala Hub', plan: 'Team Suite (6 pax) — Monthly', amount: 72000 },
  { name: 'BlueShift AI', center: 'Indiranagar Hive', plan: 'Private Cabin — Quarterly', amount: 55000 },
  { name: 'Sapphire Solutions', center: 'HSR Nexus', plan: 'Dedicated Desk — Monthly', amount: 14000 },
  { name: 'Rajan & Associates', center: 'Koramangala Hub', plan: 'Virtual Office — Annual', amount: 30000 },
];

function generateRenewals(): Renewal[] {
  const today = new Date(2026, 4, 26); // May 26, 2026
  const renewals: Renewal[] = [];

  const daysOffsets = [-15, -5, 2, 5, 8, 12, 18, 22, 28, 35, 42, 55, -30, -45, 3, -2];

  clientData.forEach((client, i) => {
    const daysUntil = daysOffsets[i];
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysUntil);

    const startDate = new Date(endDate);
    const planDuration = client.plan.includes('Annual') ? 365 : client.plan.includes('Quarterly') ? 90 : 30;
    startDate.setDate(startDate.getDate() - planDuration);

    let status: RenewalStatus;
    if (daysUntil < -10) status = 'expired';
    else if (daysUntil < 0) status = 'expired';
    else if (daysUntil <= 7) status = 'due';
    else if (daysUntil <= 30) status = 'upcoming';
    else status = 'upcoming';

    // Override some as renewed
    if (i === 0 || i === 5 || i === 8 || i === 11) {
      status = 'renewed';
    }

    renewals.push({
      id: `ren-${i + 1}`,
      client: client.name,
      center: client.center,
      plan: client.plan,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      amount: client.amount,
      status,
      daysUntilExpiry: daysUntil,
    });
  });

  return renewals.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const statusStyles: Record<RenewalStatus, { className: string; label: string; icon: typeof Clock }> = {
  upcoming: { className: 'bg-blue-500/15 text-blue-400 border-blue-500/20', label: 'Upcoming', icon: CalendarClock },
  due: { className: 'bg-amber-500/15 text-amber-400 border-amber-500/20', label: 'Due', icon: AlertTriangle },
  renewed: { className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Renewed', icon: CheckCircle2 },
  expired: { className: 'bg-red-500/15 text-red-400 border-red-500/20', label: 'Expired', icon: XCircle },
};

// --- Component ---
export default function RenewalsPage() {
  const [renewals, setRenewals] = React.useState<Renewal[]>(() => generateRenewals());
  const [renewDialogOpen, setRenewDialogOpen] = React.useState(false);
  const [selectedRenewal, setSelectedRenewal] = React.useState<Renewal | null>(null);
  const [formNewEndDate, setFormNewEndDate] = React.useState('');
  const [formNewAmount, setFormNewAmount] = React.useState('');
  const [formNotes, setFormNotes] = React.useState('');

  const stats = React.useMemo(() => {
    const today = new Date(2026, 4, 26);
    const endOfMonth = new Date(2026, 5, 0);
    const daysInMonth = endOfMonth.getDate() - today.getDate();

    return {
      dueThisMonth: renewals.filter((r) =>
        r.status !== 'renewed' && r.daysUntilExpiry >= 0 && r.daysUntilExpiry <= daysInMonth
      ).length,
      upcoming30: renewals.filter((r) =>
        r.status !== 'renewed' && r.daysUntilExpiry > 0 && r.daysUntilExpiry <= 30
      ).length,
      renewed: renewals.filter((r) => r.status === 'renewed').length,
      expired: renewals.filter((r) => r.status === 'expired').length,
    };
  }, [renewals]);

  function openRenewDialog(renewal: Renewal) {
    setSelectedRenewal(renewal);
    // Pre-fill new end date: current end date + plan duration
    const currentEnd = new Date(renewal.endDate);
    const duration = renewal.plan.includes('Annual') ? 365 : renewal.plan.includes('Quarterly') ? 90 : 30;
    currentEnd.setDate(currentEnd.getDate() + duration);
    setFormNewEndDate(currentEnd.toISOString().split('T')[0]);
    setFormNewAmount(String(renewal.amount));
    setFormNotes('');
    setRenewDialogOpen(true);
  }

  function handleRenew() {
    if (!selectedRenewal || !formNewEndDate || !formNewAmount) return;

    setRenewals((prev) =>
      prev.map((r) =>
        r.id === selectedRenewal.id
          ? { ...r, status: 'renewed' as RenewalStatus, endDate: formNewEndDate, amount: parseFloat(formNewAmount) }
          : r
      )
    );
    setRenewDialogOpen(false);
    setSelectedRenewal(null);
  }

  function getDaysColor(days: number, status: RenewalStatus): string {
    if (status === 'renewed') return 'text-emerald-400';
    if (days < 0) return 'text-red-400';
    if (days < 7) return 'text-red-400';
    if (days < 30) return 'text-amber-400';
    return 'text-emerald-400';
  }

  function getDaysBg(days: number, status: RenewalStatus): string {
    if (status === 'renewed') return 'bg-emerald-500/10';
    if (days < 0) return 'bg-red-500/10';
    if (days < 7) return 'bg-red-500/10';
    if (days < 30) return 'bg-amber-500/10';
    return 'bg-emerald-500/10';
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Renewals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage membership renewals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: 'Due This Month',
              value: stats.dueThisMonth,
              icon: CalendarClock,
              color: 'text-amber-400',
              iconColor: 'text-amber-500',
              bgColor: 'from-amber-500/10 to-amber-500/5',
            },
            {
              label: 'Upcoming (30 days)',
              value: stats.upcoming30,
              icon: Clock,
              color: 'text-blue-400',
              iconColor: 'text-blue-500',
              bgColor: 'from-blue-500/10 to-blue-500/5',
            },
            {
              label: 'Renewed',
              value: stats.renewed,
              icon: CalendarCheck,
              color: 'text-emerald-400',
              iconColor: 'text-emerald-500',
              bgColor: 'from-emerald-500/10 to-emerald-500/5',
            },
            {
              label: 'Expired',
              value: stats.expired,
              icon: CalendarX,
              color: 'text-red-400',
              iconColor: 'text-red-500',
              bgColor: 'from-red-500/10 to-red-500/5',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                'rounded-xl border border-white/[0.06] bg-gradient-to-br p-4',
                stat.bgColor
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                <stat.icon className={cn('size-4', stat.iconColor)} />
              </div>
              <p className={cn('mt-2 text-2xl font-bold', stat.color)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile Cards View */}
        <div className="space-y-3 lg:hidden">
          {renewals.map((renewal) => {
            const st = statusStyles[renewal.status];
            return (
              <div
                key={renewal.id}
                className="rounded-xl border border-white/[0.06] bg-slate-900/60 p-4 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white">
                      {renewal.client}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {renewal.center}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px] shrink-0 ml-2', st.className)}>
                    {st.label}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Plan</p>
                    <p className="mt-0.5 text-xs text-slate-300">{renewal.plan}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Amount</p>
                    <p className="mt-0.5 text-xs font-medium text-white">{formatCurrency(renewal.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">End Date</p>
                    <p className="mt-0.5 text-xs text-slate-300">{formatDate(renewal.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Days Left</p>
                    <span className={cn(
                      'mt-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold',
                      getDaysColor(renewal.daysUntilExpiry, renewal.status),
                      getDaysBg(renewal.daysUntilExpiry, renewal.status)
                    )}>
                      {renewal.status === 'renewed'
                        ? '✓ Renewed'
                        : renewal.daysUntilExpiry < 0
                        ? `${Math.abs(renewal.daysUntilExpiry)}d overdue`
                        : `${renewal.daysUntilExpiry}d`}
                    </span>
                  </div>
                </div>
                {renewal.status !== 'renewed' && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-3"
                      onClick={() => openRenewDialog(renewal)}
                    >
                      <RefreshCw className="size-3 mr-1" />
                      Renew
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Client</TableHead>
                <TableHead className="text-slate-400 text-xs">Center</TableHead>
                <TableHead className="text-slate-400 text-xs">Plan</TableHead>
                <TableHead className="text-slate-400 text-xs">End Date</TableHead>
                <TableHead className="text-slate-400 text-xs text-center">Days Left</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Amount</TableHead>
                <TableHead className="text-slate-400 text-xs">Status</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renewals.map((renewal) => {
                const st = statusStyles[renewal.status];
                return (
                  <TableRow
                    key={renewal.id}
                    className="border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <TableCell className="text-sm font-medium text-slate-200 max-w-[160px] truncate">
                      {renewal.client}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {renewal.center}
                    </TableCell>
                    <TableCell className="text-xs text-slate-300 max-w-[180px] truncate">
                      {renewal.plan}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {formatDate(renewal.endDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                          getDaysColor(renewal.daysUntilExpiry, renewal.status),
                          getDaysBg(renewal.daysUntilExpiry, renewal.status)
                        )}
                      >
                        {renewal.status === 'renewed'
                          ? '✓ Renewed'
                          : renewal.daysUntilExpiry < 0
                          ? `${Math.abs(renewal.daysUntilExpiry)}d overdue`
                          : `${renewal.daysUntilExpiry}d`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-white">
                      {formatCurrency(renewal.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px]', st.className)}
                      >
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {renewal.status !== 'renewed' ? (
                        <Button
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-3"
                          onClick={() => openRenewDialog(renewal)}
                        >
                          <RefreshCw className="size-3 mr-1" />
                          Renew
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-400/60">Completed</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Renew Dialog */}
        <Dialog open={renewDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setRenewDialogOpen(false);
            setSelectedRenewal(null);
          }
        }}>
          <DialogContent className="sm:max-w-md bg-slate-900 border border-white/10 text-slate-200">
            {selectedRenewal && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Confirm Renewal
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Renew membership for {selectedRenewal.client}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="rounded-lg border border-white/[0.06] bg-slate-800/50 p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Client</span>
                      <span className="text-slate-200 font-medium">{selectedRenewal.client}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Center</span>
                      <span className="text-slate-200">{selectedRenewal.center}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Plan</span>
                      <span className="text-slate-200">{selectedRenewal.plan}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current End Date</span>
                      <span className="text-slate-200">{formatDate(selectedRenewal.endDate)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">New End Date</label>
                    <Input
                      type="date"
                      value={formNewEndDate}
                      onChange={(e) => setFormNewEndDate(e.target.value)}
                      className="h-9 border-white/[0.08] bg-slate-800 text-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Renewal Amount (₹)</label>
                    <Input
                      type="number"
                      value={formNewAmount}
                      onChange={(e) => setFormNewAmount(e.target.value)}
                      className="h-9 border-white/[0.08] bg-slate-800 text-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Notes (optional)</label>
                    <textarea
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Any renewal notes..."
                      rows={3}
                      className="w-full rounded-lg border border-white/[0.08] bg-slate-800 px-2.5 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none resize-none"
                    />
                  </div>
                </div>
                <DialogFooter showCloseButton>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
                    onClick={handleRenew}
                  >
                    <CheckCircle2 className="size-3.5" />
                    Confirm Renewal
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
