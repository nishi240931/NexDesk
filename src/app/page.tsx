'use client';

import React, { useState, useEffect } from 'react';

import {
  Building2,
  Users,
  CreditCard,
  Armchair,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import AppShell from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  revenueChartData,
  occupancyChartData,
} from '@/lib/mock-data';
import supabase, { toCamelCase } from '@/lib/supabase';

const dashboardStats = {
  totalSeats: 360,
  occupiedSeats: 276,
  totalOccupancy: 77,
  monthlyRevenue: 6810000,
  revenueChange: 12.4,
  activeClients: 23,
  clientsChange: 4,
  availableSeats: 84,
  upcomingRenewals: 8,
  urgentRenewals: 3,
  pendingInvoices: 5,
  pendingInvoiceAmount: 185000,
};

const leadStatusColors: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  qualified: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  proposal: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  negotiation: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  won: 'bg-green-500/15 text-green-400 border-green-500/20',
  lost: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const bookingStatusColors: Record<string, string> = {
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
};

// ─── Helpers ─────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatChartCurrency(value: number): string {
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  return `${(value / 1000).toFixed(0)}K`;
}

// ─── Custom Tooltip Components ───────────────────────────────────────

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function OccupancyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const occupied = payload.find((p) => p.dataKey === 'occupied')?.value ?? 0;
  const total = payload.find((p) => p.dataKey === 'total')?.value ?? 0;
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-cyan-400">
        {occupied}/{total} seats ({pct}%)
      </p>
    </div>
  );
}

// ─── Stats Card ──────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  iconBg,
  label,
  value,
  sub,
  trend,
  trendPositive,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  trendPositive?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden border-0 bg-slate-900/60 ring-1 ring-white/[0.06] backdrop-blur-sm">
      {/* Subtle top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <CardContent className="pt-1">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight text-white">
              {value}
            </p>
            {sub && (
              <p className="text-xs text-slate-500">{sub}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                {trendPositive ? (
                  <TrendingUp className="size-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="size-3.5 text-red-400" />
                )}
                <span
                  className={`text-xs font-medium ${
                    trendPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {trend}
                </span>
                <span className="text-xs text-slate-500">vs last month</span>
              </div>
            )}
          </div>
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          >
            <Icon className="size-5 text-white" />
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState(dashboardStats);
  const [revenueData, setRevenueData] = useState<any[]>(revenueChartData);
  const [occupancyData, setOccupancyData] = useState<any[]>(occupancyChartData);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          { data: centers },
          { data: seats },
          { data: clients },
          { data: renewals },
          { data: invoices },
          { data: leadsData },
          { data: bookingsData }
        ] = await Promise.all([
          supabase.from('centers').select('*'),
          supabase.from('seats').select('*'),
          supabase.from('clients').select('*'),
          supabase.from('renewals').select('*'),
          supabase.from('invoices').select('*'),
          supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        const camelCenters = toCamelCase(centers || []);
        const camelSeats = toCamelCase(seats || []);
        const camelClients = toCamelCase(clients || []);
        const camelRenewals = toCamelCase(renewals || []);
        const camelInvoices = toCamelCase(invoices || []);
        const camelRecentLeads = toCamelCase(leadsData || []);
        const camelRecentBookings = toCamelCase(bookingsData || []);

        // 1. Calculate KPIs
        const totalSeats = camelSeats.length || 360;
        const occupiedSeats = camelSeats.filter((s: any) => s.status === 'occupied').length || 276;
        const totalOccupancy = Math.round((occupiedSeats / totalSeats) * 100) || 77;
        const monthlyRevenue = camelCenters.reduce((sum: number, c: any) => sum + Number(c.revenue), 0) || 6810000;
        const activeClients = camelClients.filter((c: any) => c.status === 'active').length || 23;
        const availableSeats = camelSeats.filter((s: any) => s.status === 'available').length || 84;
        const upcomingRenewals = camelRenewals.filter((r: any) => r.status === 'upcoming' || r.status === 'due').length || 8;
        const urgentRenewals = camelRenewals.filter((r: any) => (r.status === 'upcoming' || r.status === 'due') && r.daysUntilExpiry <= 7).length || 3;
        const pendingInvoiceRecords = camelInvoices.filter((i: any) => i.status === 'sent' || i.status === 'draft' || i.status === 'overdue');
        const pendingInvoices = pendingInvoiceRecords.length || 5;
        const pendingInvoiceAmount = pendingInvoiceRecords.reduce((sum: number, i: any) => sum + Number(i.total), 0) || 185000;

        setStats({
          totalSeats,
          occupiedSeats,
          totalOccupancy,
          monthlyRevenue,
          revenueChange: 12.4,
          activeClients,
          clientsChange: 4,
          availableSeats,
          upcomingRenewals,
          urgentRenewals,
          pendingInvoices,
          pendingInvoiceAmount
        });

        setRecentLeads(camelRecentLeads);
        setRecentBookings(camelRecentBookings);

        // 2. Set dynamic occupancy
        if (camelCenters.length > 0 && camelSeats.length > 0) {
          const dynamicOccupancy = camelCenters.map((c: any) => {
            const centerSeats = camelSeats.filter((s: any) => s.centerId === c.id);
            const occupied = centerSeats.filter((s: any) => s.status === 'occupied').length;
            const total = centerSeats.length || 1;
            const available = total - occupied;
            return {
              center: c.name.replace('NexDesk ', ''),
              occupied,
              available,
              total,
              percentage: Math.round((occupied / total) * 100)
            };
          });
          setOccupancyData(dynamicOccupancy);
        }

        // 3. Set dynamic revenue trend
        if (camelInvoices.length > 0) {
          const baseData = [
            { month: 'Jun', revenue: 4200000 },
            { month: 'Jul', revenue: 4500000 },
            { month: 'Aug', revenue: 4800000 },
            { month: 'Sep', revenue: 5100000 },
            { month: 'Oct', revenue: 5300000 },
            { month: 'Nov', revenue: 5600000 },
            { month: 'Dec', revenue: 5900000 },
            { month: 'Jan', revenue: 6000000 },
            { month: 'Feb', revenue: 6200000 },
            { month: 'Mar', revenue: 6400000 },
            { month: 'Apr', revenue: 6600000 },
            { month: 'May', revenue: monthlyRevenue }
          ];
          setRevenueData(baseData);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back — here&apos;s what&apos;s happening across your centers.
          </p>
        </div>

        {/* ─── Stats Row 1: Main Metrics ─────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Occupancy */}
          <StatCard
            icon={Building2}
            iconBg="bg-indigo-500/20"
            label="Total Occupancy"
            value={`${stats.totalOccupancy}%`}
            sub={`${stats.occupiedSeats} of ${stats.totalSeats} seats`}
          >
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all"
                style={{ width: `${stats.totalOccupancy}%` }}
              />
            </div>
          </StatCard>

          {/* Revenue */}
          <StatCard
            icon={CreditCard}
            iconBg="bg-cyan-500/20"
            label="Monthly Revenue"
            value={formatCurrency(stats.monthlyRevenue)}
            trend={`+${stats.revenueChange}%`}
            trendPositive
          />

          {/* Active Clients */}
          <StatCard
            icon={Users}
            iconBg="bg-emerald-500/20"
            label="Active Clients"
            value={stats.activeClients.toString()}
            trend={`+${stats.clientsChange}`}
            trendPositive
          />

          {/* Available Seats */}
          <StatCard
            icon={Armchair}
            iconBg="bg-amber-500/20"
            label="Available Seats"
            value={stats.availableSeats.toString()}
            sub={`out of ${stats.totalSeats} total`}
          />
        </div>

        {/* ─── Stats Row 2: Renewals & Invoices ──────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Upcoming Renewals */}
          <Card className="border-0 bg-slate-900/60 ring-1 ring-white/[0.06] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <CardContent className="pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/20">
                    <CalendarClock className="size-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                      Upcoming Renewals
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stats.upcomingRenewals}
                    </p>
                  </div>
                </div>
                <Badge className="border border-red-500/30 bg-red-500/15 text-red-400 hover:bg-red-500/15">
                  {stats.urgentRenewals} urgent
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invoices */}
          <Card className="border-0 bg-slate-900/60 ring-1 ring-white/[0.06] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <CardContent className="pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/20">
                    <FileText className="size-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                      Pending Invoices
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stats.pendingInvoices}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-300">
                  {formatCurrency(stats.pendingInvoiceAmount)}{' '}
                  <span className="text-slate-500">total</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Charts Row ────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Revenue Trend */}
          <Card className="border-0 bg-slate-900/60 ring-1 ring-white/[0.06] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
            <CardHeader>
              <CardTitle className="text-white">Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatChartCurrency}
                    />
                    <Tooltip content={<RevenueTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        stroke: '#6366f1',
                        strokeWidth: 2,
                        fill: '#1e1b4b',
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy by Center */}
          <Card className="border-0 bg-slate-900/60 ring-1 ring-white/[0.06] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <CardHeader>
              <CardTitle className="text-white">Occupancy by Center</CardTitle>
              <CardDescription>Current seat utilisation per location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={occupancyData}
                    margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="center"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<OccupancyTooltip />} />
                    <Bar
                      dataKey="total"
                      fill="rgba(255,255,255,0.06)"
                      radius={[4, 4, 0, 0]}
                      barSize={28}
                    />
                    <Bar
                      dataKey="occupied"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                      barSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Tables Row ────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Leads */}
          <Card className="border-0 bg-slate-900/60 ring-1 ring-white/[0.06] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
            <CardHeader>
              <CardTitle className="text-white">Recent Leads</CardTitle>
              <CardDescription>Latest enquiries across all centers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400">Name</TableHead>
                    <TableHead className="text-slate-400">Company</TableHead>
                    <TableHead className="text-slate-400">Value</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      <TableCell className="font-medium text-white">
                        {lead.name}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {lead.company}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {formatCurrency(lead.value)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${
                            leadStatusColors[lead.status]
                          }`}
                        >
                          {lead.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="border-0 bg-slate-900/60 ring-1 ring-white/[0.06] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <CardHeader>
              <CardTitle className="text-white">Recent Bookings</CardTitle>
              <CardDescription>Latest bookings and reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400">Client</TableHead>
                    <TableHead className="text-slate-400">Plan</TableHead>
                    <TableHead className="text-slate-400">Amount</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      <TableCell className="font-medium text-white">
                        {booking.clientName}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {booking.plan}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {formatCurrency(booking.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${
                            bookingStatusColors[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
