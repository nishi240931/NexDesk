# NexDesk
### Manage Every Workspace. From One Dashboard.

NexDesk is a full-stack Multi-Center Coworking CRM + ERP platform built to help coworking operators manage leads, bookings, seat allocation, renewals, billing, and business operations from a single dashboard.

---

## Problem

Coworking operators often rely on disconnected systems for:

- Lead management
- Workspace bookings
- Seat allocation
- Renewals
- Billing
- Operational tracking

This creates:
- Revenue leakage
- Poor occupancy visibility
- Manual workflows
- Operational inefficiencies

---

## Solution

NexDesk centralizes coworking operations into one platform.

Users can:

- Manage leads
- Track bookings
- Monitor seat availability
- Handle renewals
- Manage billing
- View business insights
- Operate multiple centers from one dashboard

---

## Features

### Dashboard
- Real-time occupancy tracking
- Revenue analytics
- Active clients overview
- Renewal monitoring
- Business insights

### CRM
- Lead creation and management
- Pipeline tracking
- Lead conversion workflows

### Bookings
- Workspace reservation system
- Client allocation
- Booking lifecycle management

### Seat Management
- Visual seat map
- Assign and release seats
- Occupancy monitoring

### Billing & Renewals
- Invoice generation
- Payment tracking
- Renewal workflows

---

## Workflow

Lead  
→ Booking  
→ Seat Assignment  
→ Invoice  
→ Renewal

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Supabase

### Database
- PostgreSQL

### Deployment
- Vercel

---

## Architecture

Frontend (Next.js)

↓

Supabase API

↓

PostgreSQL Database

↓

Vercel Deployment

---

## Database

Tables:

- centers
- clients
- leads
- bookings
- seats
- renewals
- invoices

Security:

- Environment variables secured
- Restricted RLS policies
- Secrets excluded from repository

---

## Local Setup

Clone repository:

```bash
git clone https://github.com/nishi240931/NexDesk.git
```

Move into project:

```bash
cd NexDesk
```

Install dependencies:

```bash
npm install
```

Create:

```env
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run locally:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Demo

Live URL:

https://nex-desk-eight.vercel.app/

GitHub Repository:

https://github.com/nishi240931/NexDesk

---

## Future Improvements

- Authentication
- Role Based Access
- Real-time Notifications
- AI Analytics
- Export Reports
- Multi-center Admin Controls
- Activity Logs

---

## Team

Project Name: NexDesk

---

Built with ❤️ using Next.js + Supabase

