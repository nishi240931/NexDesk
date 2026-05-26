// ─── NexDesk Core Types ──────────────────────────────────────────────

export type PlanType = "hot-desk" | "dedicated" | "cabin" | "meeting-room";

export type ClientStatus = "active" | "inactive";

export type LeadSource =
  | "website"
  | "referral"
  | "walkin"
  | "linkedin"
  | "google";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type SeatZone = "A" | "B" | "C" | "D";

export type SeatType = "hot-desk" | "dedicated" | "cabin" | "meeting-room";

export type SeatStatus = "available" | "occupied" | "reserved" | "maintenance";

export type RenewalStatus = "upcoming" | "due" | "renewed" | "expired";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export type CenterStatus = "active" | "inactive";

// ─── Entity Interfaces ──────────────────────────────────────────────

export interface Center {
  id: string;
  name: string;
  address: string;
  city: string;
  totalSeats: number;
  occupiedSeats: number;
  revenue: number;
  status: CenterStatus;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  center: string;
  seatNumber: string;
  plan: PlanType;
  startDate: string;
  endDate: string;
  status: ClientStatus;
  avatar: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  center: string;
  notes: string;
  createdAt: string;
  value: number;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  centerId: string;
  centerName: string;
  seatId: string;
  seatNumber: string;
  plan: PlanType;
  startDate: string;
  endDate: string;
  amount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Seat {
  id: string;
  number: string;
  floor: number;
  zone: SeatZone;
  type: SeatType;
  status: SeatStatus;
  clientName?: string;
  centerId: string;
}

export interface Renewal {
  id: string;
  clientId: string;
  clientName: string;
  bookingId: string;
  centerId: string;
  centerName: string;
  plan: PlanType;
  currentEndDate: string;
  renewalDate: string;
  amount: number;
  status: RenewalStatus;
  daysUntilExpiry: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  bookingId: string;
  centerId: string;
  centerName: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
}

// ─── Chart Data Types ───────────────────────────────────────────────

export interface RevenueChartData {
  month: string;
  revenue: number;
  target: number;
}

export interface OccupancyChartData {
  center: string;
  occupied: number;
  available: number;
  total: number;
  percentage: number;
}

export interface LeadSourceChartData {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

// ─── Navigation Types ───────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
