'use client';

import * as React from 'react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Monitor,
  DoorOpen,
  Users,
  Armchair,
  Filter,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
type SeatStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
type SeatType = 'desk' | 'cabin' | 'meeting';
type Zone = 'A' | 'B' | 'C' | 'D';

interface Seat {
  id: string;
  number: string;
  zone: Zone;
  type: SeatType;
  status: SeatStatus;
  client?: string;
  center: string;
  floor: number;
}

// --- Mock Data ---
const centers = ['Koramangala Hub', 'Indiranagar Hive', 'HSR Nexus'];
const floors = [1, 2, 3];

const clientNames = [
  'Ananya Sharma', 'Vikram Patel', 'Priya Nair', 'Rahul Iyer',
  'Deepika Joshi', 'Arjun Menon', 'Kavya Reddy', 'Suresh Gupta',
  'Meera Krishnan', 'Rohan Deshmukh', 'Sneha Bhat', 'Aditya Rao',
  'Pooja Hegde', 'Karthik Subramanian', 'Ishita Verma', 'Manish Tiwari',
  'Lakshmi Pillai', 'Nitin Kamath', 'Divya Chakraborty', 'Amit Saxena',
  'Ritu Agarwal', 'Varun Kulkarni', 'Nisha Shetty', 'Sanjay Mehta',
];

function generateSeats(): Seat[] {
  const zones: Zone[] = ['A', 'B', 'C', 'D'];
  const types: SeatType[] = ['desk', 'cabin', 'meeting'];
  const statuses: SeatStatus[] = ['available', 'occupied', 'reserved', 'maintenance'];
  const seats: Seat[] = [];
  let clientIdx = 0;

  for (const center of centers) {
    for (const floor of floors) {
      for (const zone of zones) {
        const seatCount = zone === 'A' ? 8 : zone === 'B' ? 6 : zone === 'C' ? 5 : 4;
        for (let i = 1; i <= seatCount; i++) {
          const seatNum = `${zone}${floor}${String(i).padStart(2, '0')}`;
          const typeIdx =
            zone === 'D' ? 2 : i <= 2 && zone === 'C' ? 1 : 0;
          const statusRand = Math.random();
          let status: SeatStatus;
          if (statusRand < 0.45) status = 'occupied';
          else if (statusRand < 0.7) status = 'available';
          else if (statusRand < 0.9) status = 'reserved';
          else status = 'maintenance';

          seats.push({
            id: `${center}-${floor}-${seatNum}`,
            number: seatNum,
            zone,
            type: types[typeIdx],
            status,
            client: status === 'occupied' ? clientNames[clientIdx++ % clientNames.length] : undefined,
            center,
            floor,
          });
        }
      }
    }
  }
  return seats;
}

const allSeats = generateSeats();

// --- Helpers ---
const statusConfig: Record<SeatStatus, { bg: string; border: string; dot: string; label: string }> = {
  available: { bg: 'bg-emerald-500/8', border: 'border-l-emerald-500', dot: 'bg-emerald-500', label: 'Available' },
  occupied: { bg: 'bg-indigo-500/8', border: 'border-l-indigo-500', dot: 'bg-indigo-500', label: 'Occupied' },
  reserved: { bg: 'bg-amber-500/8', border: 'border-l-amber-500', dot: 'bg-amber-500', label: 'Reserved' },
  maintenance: { bg: 'bg-red-500/8', border: 'border-l-red-400', dot: 'bg-red-400', label: 'Maintenance' },
};

const typeIcons: Record<SeatType, typeof Monitor> = {
  desk: Monitor,
  cabin: DoorOpen,
  meeting: Users,
};

const typeLabels: Record<SeatType, string> = {
  desk: 'Hot Desk',
  cabin: 'Private Cabin',
  meeting: 'Meeting Room',
};

const zoneLabels: Record<Zone, string> = {
  A: 'Zone A — Open Desks',
  B: 'Zone B — Focused Work',
  C: 'Zone C — Private Cabins',
  D: 'Zone D — Meeting Rooms',
};

// --- Component ---
export default function SeatsPage() {
  const [seats, setSeats] = React.useState<Seat[]>(() => allSeats);
  const [selectedCenter, setSelectedCenter] = React.useState(centers[0]);
  const [selectedFloor, setSelectedFloor] = React.useState<number>(1);
  const [statusFilter, setStatusFilter] = React.useState<SeatStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = React.useState<SeatType | 'all'>('all');
  const [zoneFilter, setZoneFilter] = React.useState<Zone | 'all'>('all');
  const [selectedSeat, setSelectedSeat] = React.useState<Seat | null>(null);

  const filteredSeats = React.useMemo(() => {
    return seats.filter((s) => {
      if (s.center !== selectedCenter) return false;
      if (s.floor !== selectedFloor) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      if (zoneFilter !== 'all' && s.zone !== zoneFilter) return false;
      return true;
    });
  }, [seats, selectedCenter, selectedFloor, statusFilter, typeFilter, zoneFilter]);

  const stats = React.useMemo(() => {
    const centerFloorSeats = seats.filter(
      (s) => s.center === selectedCenter && s.floor === selectedFloor
    );
    return {
      total: centerFloorSeats.length,
      available: centerFloorSeats.filter((s) => s.status === 'available').length,
      occupied: centerFloorSeats.filter((s) => s.status === 'occupied').length,
      reserved: centerFloorSeats.filter((s) => s.status === 'reserved').length,
    };
  }, [seats, selectedCenter, selectedFloor]);

  const groupedByZone = React.useMemo(() => {
    const groups: Record<Zone, Seat[]> = { A: [], B: [], C: [], D: [] };
    filteredSeats.forEach((s) => groups[s.zone].push(s));
    return groups;
  }, [filteredSeats]);

  function handleAssignSeat(seatId: string) {
    const randomClient = clientNames[Math.floor(Math.random() * clientNames.length)];
    setSeats((prev) =>
      prev.map((s) =>
        s.id === seatId
          ? { ...s, status: 'occupied', client: randomClient }
          : s
      )
    );
    setSelectedSeat((prev) => prev ? { ...prev, status: 'occupied', client: randomClient } : null);
  }

  function handleReleaseSeat(seatId: string) {
    setSeats((prev) =>
      prev.map((s) =>
        s.id === seatId
          ? { ...s, status: 'available', client: undefined }
          : s
      )
    );
    setSelectedSeat((prev) => prev ? { ...prev, status: 'available', client: undefined } : null);
  }

  return (
    <AppShell>
      <TooltipProvider>
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Seat Map
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage workspace seating across your centers
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedCenter} onValueChange={(v) => setSelectedCenter(v as string)}>
                <SelectTrigger className="h-9 w-44 border-white/[0.08] bg-slate-900 text-slate-300">
                  <SelectValue placeholder="Select center" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {centers.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(selectedFloor)} onValueChange={(v) => setSelectedFloor(Number(v))}>
                <SelectTrigger className="h-9 w-28 border-white/[0.08] bg-slate-900 text-slate-300">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {floors.map((f) => (
                    <SelectItem key={f} value={String(f)}>
                      Floor {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Total Seats', value: stats.total, color: 'text-white', bgColor: 'from-slate-800 to-slate-900' },
              { label: 'Available', value: stats.available, color: 'text-emerald-400', bgColor: 'from-emerald-500/10 to-emerald-500/5' },
              { label: 'Occupied', value: stats.occupied, color: 'text-indigo-400', bgColor: 'from-indigo-500/10 to-indigo-500/5' },
              { label: 'Reserved', value: stats.reserved, color: 'text-amber-400', bgColor: 'from-amber-500/10 to-amber-500/5' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-xl border border-white/[0.06] bg-gradient-to-br p-4',
                  stat.bgColor
                )}
              >
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                <p className={cn('mt-1 text-2xl font-bold', stat.color)}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Legend + Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4">
              {(Object.entries(statusConfig) as [SeatStatus, typeof statusConfig.available][]).map(
                ([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className={cn('h-2.5 w-2.5 rounded-full', cfg.dot)} />
                    <span className="text-xs text-slate-400">{cfg.label}</span>
                  </div>
                )
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="size-3.5 text-slate-500" />
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SeatStatus | 'all')}>
                <SelectTrigger className="h-8 w-28 border-white/[0.08] bg-slate-900/60 text-xs text-slate-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as SeatType | 'all')}>
                <SelectTrigger className="h-8 w-28 border-white/[0.08] bg-slate-900/60 text-xs text-slate-300">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="desk">Hot Desk</SelectItem>
                  <SelectItem value="cabin">Cabin</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
              <Select value={zoneFilter} onValueChange={(v) => setZoneFilter(v as Zone | 'all')}>
                <SelectTrigger className="h-8 w-24 border-white/[0.08] bg-slate-900/60 text-xs text-slate-300">
                  <SelectValue placeholder="Zone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="A">Zone A</SelectItem>
                  <SelectItem value="B">Zone B</SelectItem>
                  <SelectItem value="C">Zone C</SelectItem>
                  <SelectItem value="D">Zone D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seat Grid by Zone */}
          <div className="space-y-8">
            {(Object.entries(groupedByZone) as [Zone, Seat[]][]).map(([zone, seats]) => {
              if (seats.length === 0) return null;
              return (
                <div key={zone}>
                  <div className="mb-3 flex items-center gap-2">
                    <LayoutGrid className="size-4 text-slate-500" />
                    <h2 className="text-sm font-semibold text-slate-300">
                      {zoneLabels[zone]}
                    </h2>
                    <Badge variant="secondary" className="ml-1 bg-slate-800 text-slate-400 text-[10px]">
                      {seats.length} seats
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                    {seats.map((seat) => {
                      const cfg = statusConfig[seat.status];
                      const TypeIcon = typeIcons[seat.type];
                      const isSelected = selectedSeat?.id === seat.id;

                      const tile = (
                        <button
                          key={seat.id}
                          onClick={() =>
                            setSelectedSeat(isSelected ? null : seat)
                          }
                          className={cn(
                            'group relative flex flex-col items-center gap-1.5 rounded-xl border-l-[3px] p-3 text-center transition-all duration-200',
                            'border border-white/[0.06] hover:shadow-lg hover:shadow-black/20 hover:scale-[1.03]',
                            cfg.border,
                            cfg.bg,
                            isSelected && 'ring-2 ring-indigo-500/40 border-indigo-500/30'
                          )}
                        >
                          <TypeIcon
                            className={cn(
                              'size-5 transition-colors',
                              seat.status === 'available'
                                ? 'text-emerald-400'
                                : seat.status === 'occupied'
                                ? 'text-indigo-400'
                                : seat.status === 'reserved'
                                ? 'text-amber-400'
                                : 'text-red-400'
                            )}
                          />
                          <span className="text-xs font-semibold text-white">
                            {seat.number}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {typeLabels[seat.type].split(' ')[0]}
                          </span>
                        </button>
                      );

                      if (seat.status === 'occupied' && seat.client) {
                        return (
                          <Tooltip key={seat.id}>
                            <TooltipTrigger render={<div />}>
                              {tile}
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-slate-200 border-white/10">
                              <p className="font-medium">{seat.client}</p>
                              <p className="text-[10px] text-slate-400">{typeLabels[seat.type]}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return tile;
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Seat Detail */}
          {selectedSeat && (
            <div className="rounded-xl border border-white/[0.06] bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Seat {selectedSeat.number}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {selectedSeat.center} · Floor {selectedSeat.floor} · Zone{' '}
                    {selectedSeat.zone}
                  </p>
                </div>
                <Badge
                  className={cn(
                    'text-xs',
                    selectedSeat.status === 'available' && 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
                    selectedSeat.status === 'occupied' && 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
                    selectedSeat.status === 'reserved' && 'bg-amber-500/15 text-amber-400 border-amber-500/20',
                    selectedSeat.status === 'maintenance' && 'bg-red-500/15 text-red-400 border-red-500/20'
                  )}
                  variant="outline"
                >
                  {statusConfig[selectedSeat.status].label}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Type
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    {typeLabels[selectedSeat.type]}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Zone
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Zone {selectedSeat.zone}
                  </p>
                </div>
                {selectedSeat.client && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                      Assigned To
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      {selectedSeat.client}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Floor
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Floor {selectedSeat.floor}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {selectedSeat.status === 'available' && (
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                    onClick={() => handleAssignSeat(selectedSeat.id)}
                  >
                    Assign Seat
                  </Button>
                )}
                {selectedSeat.status === 'occupied' && (
                  <Button
                    variant="outline"
                    className="border-white/10 text-slate-300 text-xs"
                    onClick={() => handleReleaseSeat(selectedSeat.id)}
                  >
                    Release Seat
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="text-slate-400 text-xs"
                  onClick={() => setSelectedSeat(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    </AppShell>
  );
}
