'use client';

import React, { useState, useMemo, useEffect } from 'react';
import AppShell from '@/components/app-shell';
import {
  leads as allLeads,
  centers,
} from '@/lib/mock-data';
import { Lead, LeadStatus } from '@/types';
import supabase, { toCamelCase, toSnakeCase } from '@/lib/supabase';

const leadStatuses: { value: string; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

const leadStatusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  qualified: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  proposal: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  negotiation: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  won: 'bg-green-500/15 text-green-400 border-green-500/20',
  lost: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const leadSources: string[] = ['website', 'referral', 'walkin', 'linkedin', 'google'];
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Plus,
  Search,
  Filter,
  UserPlus,
  Edit3,
  ArrowRightCircle,
  Building2,
  Mail,
  Phone,
  IndianRupee,
  Calendar,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const pipelineColumns: { status: LeadStatus; label: string; color: string; bgColor: string }[] = [
  { status: 'new', label: 'New', color: 'bg-blue-500', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  { status: 'contacted', label: 'Contacted', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/10 border-yellow-500/20' },
  { status: 'qualified', label: 'Qualified', color: 'bg-purple-500', bgColor: 'bg-purple-500/10 border-purple-500/20' },
  { status: 'proposal', label: 'Proposal', color: 'bg-cyan-500', bgColor: 'bg-cyan-500/10 border-cyan-500/20' },
  { status: 'negotiation', label: 'Negotiation', color: 'bg-orange-500', bgColor: 'bg-orange-500/10 border-orange-500/20' },
  { status: 'won', label: 'Won', color: 'bg-green-500', bgColor: 'bg-green-500/10 border-green-500/20' },
  { status: 'lost', label: 'Lost', color: 'bg-red-500', bgColor: 'bg-red-500/10 border-red-500/20' },
];

const sourceColors: Record<string, string> = {
  website: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  referral: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  walkin: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  linkedin: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  google: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function formatCurrency(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatFullCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [centerFilter, setCenterFilter] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    async function loadLeads() {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setLeads(toCamelCase(data || []));
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchQuery === '' ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      const matchesCenter = centerFilter === 'all' || lead.center === centerFilter;
      return matchesSearch && matchesStatus && matchesSource && matchesCenter;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter, centerFilter]);

  const pipelineLeads = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: [],
    };
    leads.forEach((lead) => {
      grouped[lead.status].push(lead);
    });
    return grouped;
  }, [leads]);

  const totalPipelineValue = useMemo(() => {
    return leads
      .filter((l) => l.status !== 'lost')
      .reduce((sum, l) => sum + l.value, 0);
  }, [leads]);

  async function handleStatusChange(leadId: string, newStatus: LeadStatus) {
    const oldLeads = leads;
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      if (error) throw error;
    } catch (err) {
      console.error('Error updating lead status:', err);
      setLeads(oldLeads);
    }
  }

  async function handleAddLead(newLead: Omit<Lead, 'id' | 'createdAt' | 'assignedTo' | 'status'>) {
    const newId = `ld-${Date.now().toString().slice(-4)}`;
    const lead: Lead = {
      ...newLead,
      id: newId,
      status: 'new',
      assignedTo: 'Arjun Mehta',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setLeads((prev) => [lead, ...prev]);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([toSnakeCase(lead)]);
      if (error) throw error;
    } catch (err) {
      console.error('Error adding lead:', err);
      setLeads((prev) => prev.filter((l) => l.id !== newId));
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Lead Pipeline</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage and track {leads.length} leads · Pipeline value{' '}
              <span className="text-emerald-400 font-medium">{formatFullCurrency(totalPipelineValue)}</span>
            </p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger
              render={
                <Button className="bg-indigo-600 text-white hover:bg-indigo-500 gap-2 h-9 px-4">
                  <Plus className="h-4 w-4" />
                  Add Lead
                </Button>
              }
            />
            <AddLeadDialog onClose={() => setAddDialogOpen(false)} onAdd={handleAddLead} />
          </Dialog>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border-slate-700/60 bg-slate-800/50 pl-9 text-sm text-slate-300 placeholder:text-slate-600"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
              <SelectTrigger className="h-9 w-[140px] border-slate-700/60 bg-slate-800/50 text-slate-300 text-xs">
                <Filter className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                {leadStatuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={(val) => setSourceFilter(val || 'all')}>
              <SelectTrigger className="h-9 w-[140px] border-slate-700/60 bg-slate-800/50 text-slate-300 text-xs">
                <Globe className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Sources</SelectItem>
                {leadSources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={centerFilter} onValueChange={(val) => setCenterFilter(val || 'all')}>
              <SelectTrigger className="h-9 w-[160px] border-slate-700/60 bg-slate-800/50 text-slate-300 text-xs">
                <Building2 className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                <SelectValue placeholder="Center" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Centers</SelectItem>
                {centers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pipeline Kanban */}
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/30 p-4">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200">Pipeline View</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {pipelineColumns.map((col) => {
              const columnLeads = pipelineLeads[col.status];
              const columnValue = columnLeads.reduce((sum, l) => sum + l.value, 0);
              return (
                <div
                  key={col.status}
                  className="flex min-w-[260px] max-w-[280px] shrink-0 snap-start flex-col rounded-xl border border-slate-800/40 bg-slate-900/60"
                >
                  {/* Column header */}
                  <div className={cn('flex items-center justify-between rounded-t-xl border-b border-slate-800/40 px-3 py-2.5', col.bgColor)}>
                    <div className="flex items-center gap-2">
                      <div className={cn('h-2.5 w-2.5 rounded-full', col.color)} />
                      <span className="text-sm font-semibold text-slate-200">{col.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 px-1.5 text-[10px] font-bold text-slate-300">
                        {columnLeads.length}
                      </span>
                    </div>
                  </div>
                  {/* Column value */}
                  <div className="border-b border-slate-800/30 px-3 py-1.5">
                    <span className="text-xs text-slate-500">
                      {formatFullCurrency(columnValue)}
                    </span>
                  </div>
                  {/* Cards */}
                  <div className="flex flex-col gap-2 p-2 min-h-[120px] max-h-[360px] overflow-y-auto">
                    {columnLeads.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center py-8">
                        <span className="text-xs text-slate-600">No leads</span>
                      </div>
                    ) : (
                      columnLeads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads table */}
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/30">
          <div className="flex items-center justify-between border-b border-slate-800/40 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-200">
              All Leads
              <span className="ml-2 text-xs font-normal text-slate-500">
                ({filteredLeads.length} results)
              </span>
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800/40 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs font-semibold">Name</TableHead>
                <TableHead className="text-slate-400 text-xs font-semibold">Email</TableHead>
                <TableHead className="text-slate-400 text-xs font-semibold">Company</TableHead>
                <TableHead className="text-slate-400 text-xs font-semibold">Source</TableHead>
                <TableHead className="text-slate-400 text-xs font-semibold">Status</TableHead>
                <TableHead className="text-slate-400 text-xs font-semibold text-right">Value</TableHead>
                <TableHead className="text-slate-400 text-xs font-semibold">Center</TableHead>
                <TableHead className="text-slate-400 text-xs font-semibold">Created</TableHead>
                <TableHead className="text-slate-400 text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                >
                  <TableCell className="font-medium text-slate-200">{lead.name}</TableCell>
                  <TableCell className="text-slate-400 text-xs">{lead.email}</TableCell>
                  <TableCell className="text-slate-300">{lead.company}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                        sourceColors[lead.source] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                      )}
                    >
                      {lead.source}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize',
                        leadStatusColors[lead.status]
                      )}
                    >
                      {lead.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-200">
                    {formatFullCurrency(lead.value)}
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs max-w-[140px] truncate">
                    {centers.find((c) => c.id === lead.center)?.name || lead.center}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">{lead.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => handleStatusChange(lead.id, 'won')}
                        title="Mark Won"
                      >
                        <ArrowRightCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                    No leads match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}

/* ── Lead Card for Kanban ─────────────────────────────────────────── */
function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="group rounded-lg border border-slate-800/50 bg-slate-800/30 p-3 transition-all duration-200 hover:border-slate-700/60 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-black/20 cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{lead.name}</p>
          <p className="text-xs text-slate-500 truncate">{lead.company}</p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-emerald-400">
          {formatCurrency(lead.value)}
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
            sourceColors[lead.source] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'
          )}
        >
          {lead.source}
        </span>
        <span className="ml-auto text-[10px] text-slate-600">{lead.createdAt}</span>
      </div>
    </div>
  );
}

/* ── Add Lead Dialog ──────────────────────────────────────────────── */
function AddLeadDialog({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState('website');
  const [center, setCenter] = useState('ctr-001');
  const [value, setValue] = useState('75000');

  function handleSubmit() {
    if (!name || !company) return;
    onAdd({
      name,
      email,
      phone,
      company,
      source: source as any,
      center,
      value: parseFloat(value) || 0,
      notes: 'Manually added via pipeline.',
    });
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700/60 text-slate-200">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-indigo-400" />
          Add New Lead
        </DialogTitle>
        <DialogDescription className="text-slate-400">
          Enter the lead details below to add them to your pipeline.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-200 placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@company.com"
              className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-200 placeholder:text-slate-600"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Phone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-200 placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Company</label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-200 placeholder:text-slate-600"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Source</label>
            <Select value={source} onValueChange={(val) => setSource(val || 'website')}>
              <SelectTrigger className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-300 w-full">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {leadSources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Center</label>
            <Select value={center} onValueChange={(val) => setCenter(val || 'ctr-001')}>
              <SelectTrigger className="h-9 border-slate-700/60 bg-slate-800/50 text-sm text-slate-300 w-full">
                <SelectValue placeholder="Select center" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {centers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Estimated Deal Value (₹)</label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 75000"
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
          Add Lead
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
