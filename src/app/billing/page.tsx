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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Receipt,
  Plus,
  Eye,
  CheckCircle2,
  Download,
  IndianRupee,
  TrendingUp,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  center: string;
  amount: number;
  taxRate: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  booking: string;
}

// --- Mock Data ---
const clients = [
  'TechVista Solutions', 'GreenLeaf Analytics', 'Pinnacle Designs',
  'CloudNine Innovations', 'Quantum Labs', 'SilverLine Media',
  'Infra Dynamics Pvt Ltd', 'NovaBridge Consulting', 'AuraStack Technologies',
  'MintRoute Logistics', 'CrestView Capital', 'Pixel Forge Studio',
  'Horizon Data Systems', 'BlueShift AI', 'Sapphire Solutions',
];

const centers = ['Koramangala Hub', 'Indiranagar Hive', 'HSR Nexus'];

const bookings = [
  'Hot Desk — Monthly', 'Private Cabin — Quarterly', 'Meeting Room — Daily',
  'Dedicated Desk — Monthly', 'Team Suite (6 pax) — Monthly',
  'Virtual Office — Annual', 'Event Space — One-time',
];

function generateInvoices(): Invoice[] {
  const statuses: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
  const invoices: Invoice[] = [];

  const amounts = [
    8500, 15000, 2500, 12000, 45000, 6000, 25000, 18000, 3500,
    9500, 32000, 7500, 11000, 55000, 4200, 19500, 28000, 8000,
  ];

  for (let i = 0; i < 18; i++) {
    const amount = amounts[i];
    const taxRate = 18;
    const tax = Math.round(amount * taxRate / 100);
    const total = amount + tax;
    const statusIdx = i < 7 ? 2 : i < 10 ? 1 : i < 14 ? 3 : i < 16 ? 0 : 4;
    const status = statuses[statusIdx];

    const issuedMonth = i < 9 ? '05' : i < 14 ? '04' : '03';
    const issuedDay = String(((i * 3 + 5) % 28) + 1).padStart(2, '0');
    const dueMonth = i < 9 ? '06' : i < 14 ? '05' : '04';
    const dueDay = String(((i * 3 + 5) % 28) + 1).padStart(2, '0');

    invoices.push({
      id: `inv-${i + 1}`,
      invoiceNumber: `NXD-2026-${String(1001 + i)}`,
      client: clients[i % clients.length],
      center: centers[i % centers.length],
      amount,
      taxRate,
      tax,
      total,
      status,
      issuedDate: `2026-${issuedMonth}-${issuedDay}`,
      dueDate: `2026-${dueMonth}-${dueDay}`,
      paidDate: status === 'paid' ? `2026-${issuedMonth}-${String(Math.min(28, parseInt(issuedDay) + 5)).padStart(2, '0')}` : undefined,
      booking: bookings[i % bookings.length],
    });
  }
  return invoices;
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

const statusStyles: Record<InvoiceStatus, { className: string; label: string }> = {
  draft: { className: 'bg-slate-500/15 text-slate-400 border-slate-500/20', label: 'Draft' },
  sent: { className: 'bg-blue-500/15 text-blue-400 border-blue-500/20', label: 'Sent' },
  paid: { className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Paid' },
  overdue: { className: 'bg-red-500/15 text-red-400 border-red-500/20', label: 'Overdue' },
  cancelled: { className: 'bg-slate-500/15 text-slate-500 border-slate-500/20 line-through', label: 'Cancelled' },
};

// --- Component ---
export default function BillingPage() {
  const [invoices, setInvoices] = React.useState<Invoice[]>(() => generateInvoices());
  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [viewInvoice, setViewInvoice] = React.useState<Invoice | null>(null);

  // Generate invoice form state
  const [formClient, setFormClient] = React.useState('');
  const [formBooking, setFormBooking] = React.useState('');
  const [formAmount, setFormAmount] = React.useState('');
  const [formTaxRate, setFormTaxRate] = React.useState('18');
  const [formDueDate, setFormDueDate] = React.useState('');
  const [formCenter, setFormCenter] = React.useState('');

  const stats = React.useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = invoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
    const pending = invoices.filter((i) => i.status === 'sent' || i.status === 'draft').reduce((sum, inv) => sum + inv.total, 0);
    const overdue = invoices.filter((i) => i.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
    return { totalInvoiced, paid, pending, overdue };
  }, [invoices]);

  function handleMarkAsPaid(invoiceId: string) {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'paid' as InvoiceStatus,
              paidDate: new Date().toISOString().split('T')[0],
            }
          : inv
      )
    );
  }

  function handleGenerateInvoice() {
    if (!formClient || !formBooking || !formAmount || !formDueDate || !formCenter) return;

    const amount = parseFloat(formAmount);
    const taxRate = parseFloat(formTaxRate) || 18;
    const tax = Math.round(amount * taxRate / 100);
    const total = amount + tax;

    const newInvoice: Invoice = {
      id: `inv-${invoices.length + 1}`,
      invoiceNumber: `NXD-2026-${String(1001 + invoices.length)}`,
      client: formClient,
      center: formCenter,
      amount,
      taxRate,
      tax,
      total,
      status: 'draft',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: formDueDate,
      booking: formBooking,
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    setGenerateOpen(false);
    setFormClient('');
    setFormBooking('');
    setFormAmount('');
    setFormTaxRate('18');
    setFormDueDate('');
    setFormCenter('');
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Invoices
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage billing and invoice lifecycle
            </p>
          </div>
          <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
            <DialogTrigger
              render={
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
                  <Plus className="size-4" />
                  Generate Invoice
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md bg-slate-900 border border-white/10 text-slate-200">
              <DialogHeader>
                <DialogTitle className="text-white">Generate New Invoice</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Create a new invoice for a client booking.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Client</label>
                  <Select value={formClient} onValueChange={(val) => setFormClient(val || '')}>
                    <SelectTrigger className="h-9 border-white/[0.08] bg-slate-800 text-slate-300 w-full">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      {clients.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Center</label>
                  <Select value={formCenter} onValueChange={(val) => setFormCenter(val || '')}>
                    <SelectTrigger className="h-9 border-white/[0.08] bg-slate-800 text-slate-300 w-full">
                      <SelectValue placeholder="Select center" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      {centers.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Booking</label>
                  <Select value={formBooking} onValueChange={(val) => setFormBooking(val || '')}>
                    <SelectTrigger className="h-9 border-white/[0.08] bg-slate-800 text-slate-300 w-full">
                      <SelectValue placeholder="Select booking" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      {bookings.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Amount (₹)</label>
                    <Input
                      type="number"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="15000"
                      className="h-9 border-white/[0.08] bg-slate-800 text-slate-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Tax Rate (%)</label>
                    <Input
                      type="number"
                      value={formTaxRate}
                      onChange={(e) => setFormTaxRate(e.target.value)}
                      placeholder="18"
                      className="h-9 border-white/[0.08] bg-slate-800 text-slate-300"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Due Date</label>
                  <Input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="h-9 border-white/[0.08] bg-slate-800 text-slate-300"
                  />
                </div>
                {formAmount && (
                  <div className="rounded-lg border border-white/[0.06] bg-slate-800/50 p-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Subtotal</span>
                      <span>{formatCurrency(parseFloat(formAmount) || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>GST ({formTaxRate || 18}%)</span>
                      <span>{formatCurrency(Math.round((parseFloat(formAmount) || 0) * (parseFloat(formTaxRate) || 18) / 100))}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-white/[0.06] pt-2 text-sm font-semibold text-white">
                      <span>Total</span>
                      <span>{formatCurrency((parseFloat(formAmount) || 0) + Math.round((parseFloat(formAmount) || 0) * (parseFloat(formTaxRate) || 18) / 100))}</span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter showCloseButton>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleGenerateInvoice}
                >
                  Create Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: 'Total Invoiced',
              value: formatCurrency(stats.totalInvoiced),
              icon: IndianRupee,
              color: 'text-white',
              iconColor: 'text-slate-400',
              bgColor: 'from-slate-800 to-slate-900',
            },
            {
              label: 'Paid',
              value: formatCurrency(stats.paid),
              icon: TrendingUp,
              color: 'text-emerald-400',
              iconColor: 'text-emerald-500',
              bgColor: 'from-emerald-500/10 to-emerald-500/5',
            },
            {
              label: 'Pending',
              value: formatCurrency(stats.pending),
              icon: Clock,
              color: 'text-blue-400',
              iconColor: 'text-blue-500',
              bgColor: 'from-blue-500/10 to-blue-500/5',
            },
            {
              label: 'Overdue',
              value: formatCurrency(stats.overdue),
              icon: AlertTriangle,
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
              <p className={cn('mt-2 text-xl font-bold', stat.color)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Invoice Table */}
        <div className="rounded-xl border border-white/[0.06] bg-slate-900/40 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Invoice #</TableHead>
                <TableHead className="text-slate-400 text-xs">Client</TableHead>
                <TableHead className="text-slate-400 text-xs hidden md:table-cell">Center</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Amount</TableHead>
                <TableHead className="text-slate-400 text-xs text-right hidden sm:table-cell">Tax</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Total</TableHead>
                <TableHead className="text-slate-400 text-xs">Status</TableHead>
                <TableHead className="text-slate-400 text-xs hidden lg:table-cell">Issued</TableHead>
                <TableHead className="text-slate-400 text-xs hidden lg:table-cell">Due</TableHead>
                <TableHead className="text-slate-400 text-xs hidden xl:table-cell">Paid</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => {
                const st = statusStyles[inv.status];
                return (
                  <TableRow
                    key={inv.id}
                    className="border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <TableCell className="font-mono text-xs text-indigo-400">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-sm text-slate-200 max-w-[140px] truncate">
                      {inv.client}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 hidden md:table-cell">
                      {inv.center}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-300">
                      {formatCurrency(inv.amount)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-500 hidden sm:table-cell">
                      {formatCurrency(inv.tax)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-white">
                      {formatCurrency(inv.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px]', st.className)}
                      >
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 hidden lg:table-cell">
                      {formatDate(inv.issuedDate)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 hidden lg:table-cell">
                      {formatDate(inv.dueDate)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 hidden xl:table-cell">
                      {inv.paidDate ? formatDate(inv.paidDate) : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-slate-500 hover:text-white"
                          onClick={() => setViewInvoice(inv)}
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        {(inv.status === 'sent' || inv.status === 'overdue') && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-emerald-500 hover:text-emerald-400"
                            onClick={() => handleMarkAsPaid(inv.id)}
                          >
                            <CheckCircle2 className="size-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-slate-500 hover:text-white"
                        >
                          <Download className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* View Invoice Dialog */}
        <Dialog open={!!viewInvoice} onOpenChange={(open) => !open && setViewInvoice(null)}>
          <DialogContent className="sm:max-w-md bg-slate-900 border border-white/10 text-slate-200">
            {viewInvoice && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {viewInvoice.invoiceNumber}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Invoice details for {viewInvoice.client}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Client</p>
                      <p className="mt-0.5 text-sm text-slate-200">{viewInvoice.client}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Center</p>
                      <p className="mt-0.5 text-sm text-slate-200">{viewInvoice.center}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Booking</p>
                      <p className="mt-0.5 text-sm text-slate-200">{viewInvoice.booking}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Status</p>
                      <Badge variant="outline" className={cn('mt-0.5 text-[10px]', statusStyles[viewInvoice.status].className)}>
                        {statusStyles[viewInvoice.status].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-slate-800/50 p-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Subtotal</span>
                      <span>{formatCurrency(viewInvoice.amount)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>GST ({viewInvoice.taxRate}%)</span>
                      <span>{formatCurrency(viewInvoice.tax)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-white/[0.06] pt-2 text-sm font-semibold text-white">
                      <span>Total</span>
                      <span>{formatCurrency(viewInvoice.total)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Issued</p>
                      <p className="mt-0.5 text-xs text-slate-300">{formatDate(viewInvoice.issuedDate)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Due</p>
                      <p className="mt-0.5 text-xs text-slate-300">{formatDate(viewInvoice.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Paid</p>
                      <p className="mt-0.5 text-xs text-slate-300">
                        {viewInvoice.paidDate ? formatDate(viewInvoice.paidDate) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter showCloseButton>
                  {(viewInvoice.status === 'sent' || viewInvoice.status === 'overdue') && (
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      onClick={() => {
                        handleMarkAsPaid(viewInvoice.id);
                        setViewInvoice(null);
                      }}
                    >
                      <CheckCircle2 className="size-3.5" />
                      Mark as Paid
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
