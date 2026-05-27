-- NexDesk database schema
-- Created: 2026-05-27

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.centers (
    id text PRIMARY KEY,
    name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    total_seats integer NOT NULL,
    occupied_seats integer NOT NULL DEFAULT 0,
    revenue numeric NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clients (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    company text NOT NULL,
    center_id text REFERENCES public.centers(id) ON DELETE SET NULL,
    seat_number text,
    plan text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status text NOT NULL DEFAULT 'active',
    avatar text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leads (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    company text NOT NULL,
    source text NOT NULL,
    status text NOT NULL DEFAULT 'new',
    assigned_to text NOT NULL DEFAULT 'Arjun Mehta',
    center_id text REFERENCES public.centers(id) ON DELETE SET NULL,
    notes text,
    value numeric NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id text PRIMARY KEY,
    client_id text REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name text NOT NULL,
    center_id text REFERENCES public.centers(id) ON DELETE SET NULL,
    center_name text NOT NULL,
    seat_id text,
    seat_number text NOT NULL,
    plan text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    amount numeric NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'confirmed',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seats (
    id text PRIMARY KEY,
    number text NOT NULL,
    floor integer NOT NULL,
    zone text NOT NULL,
    type text NOT NULL,
    status text NOT NULL DEFAULT 'available',
    client_name text,
    center_id text REFERENCES public.centers(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.renewals (
    id text PRIMARY KEY,
    client_id text REFERENCES public.clients(id) ON DELETE CASCADE,
    client_name text NOT NULL,
    booking_id text REFERENCES public.bookings(id) ON DELETE CASCADE,
    center_id text REFERENCES public.centers(id) ON DELETE CASCADE,
    center_name text NOT NULL,
    plan text NOT NULL,
    current_end_date date NOT NULL,
    renewal_date date NOT NULL,
    amount numeric NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'upcoming',
    days_until_expiry integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id text PRIMARY KEY,
    invoice_number text NOT NULL UNIQUE,
    client_id text REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name text NOT NULL,
    booking_id text REFERENCES public.bookings(id) ON DELETE SET NULL,
    center_id text REFERENCES public.centers(id) ON DELETE SET NULL,
    center_name text NOT NULL,
    amount numeric NOT NULL DEFAULT 0,
    tax numeric NOT NULL DEFAULT 0,
    total numeric NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'draft',
    issued_date date NOT NULL,
    due_date date NOT NULL,
    paid_date date,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 3. Define SELECT, INSERT, UPDATE Policies (Bypass/Skip auth, Restrict DELETE)
CREATE POLICY "Allow SELECT for all" ON public.centers FOR SELECT USING (true);
CREATE POLICY "Allow INSERT for all" ON public.centers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow UPDATE for all" ON public.centers FOR UPDATE USING (true);

CREATE POLICY "Allow SELECT for all" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow INSERT for all" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow UPDATE for all" ON public.clients FOR UPDATE USING (true);

CREATE POLICY "Allow SELECT for all" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow INSERT for all" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow UPDATE for all" ON public.leads FOR UPDATE USING (true);

CREATE POLICY "Allow SELECT for all" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow INSERT for all" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow UPDATE for all" ON public.bookings FOR UPDATE USING (true);

CREATE POLICY "Allow SELECT for all" ON public.seats FOR SELECT USING (true);
CREATE POLICY "Allow INSERT for all" ON public.seats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow UPDATE for all" ON public.seats FOR UPDATE USING (true);

CREATE POLICY "Allow SELECT for all" ON public.renewals FOR SELECT USING (true);
CREATE POLICY "Allow INSERT for all" ON public.renewals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow UPDATE for all" ON public.renewals FOR UPDATE USING (true);

CREATE POLICY "Allow SELECT for all" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow INSERT for all" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow UPDATE for all" ON public.invoices FOR UPDATE USING (true);

-- 4. Seed Data
INSERT INTO public.centers (id, name, address, city, total_seats, occupied_seats, revenue, status) VALUES
('ctr-001', 'NexDesk Indiranagar', '312, 100 Feet Road, Indiranagar', 'Bangalore', 120, 98, 2450000, 'active'),
('ctr-002', 'NexDesk Koramangala', '45, 5th Block, Koramangala', 'Bangalore', 80, 72, 1820000, 'active'),
('ctr-003', 'NexDesk HSR Layout', 'Sector 2, 27th Main, HSR Layout', 'Bangalore', 60, 41, 980000, 'active'),
('ctr-004', 'NexDesk Whitefield', 'ITPL Main Road, Whitefield', 'Bangalore', 100, 65, 1560000, 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address, city = EXCLUDED.city, total_seats = EXCLUDED.total_seats, occupied_seats = EXCLUDED.occupied_seats, revenue = EXCLUDED.revenue;

INSERT INTO public.clients (id, name, email, phone, company, center_id, seat_number, plan, start_date, end_date, status, avatar) VALUES
('cli-001', 'Priya Sharma', 'priya.sharma@techlabs.in', '+91 98451 23456', 'TechLabs India', 'ctr-001', 'A-12', 'dedicated', '2025-11-01', '2026-10-31', 'active', 'PS'),
('cli-002', 'Rahul Verma', 'rahul.v@cloudnine.io', '+91 99001 45678', 'CloudNine Solutions', 'ctr-001', 'B-05', 'cabin', '2026-01-15', '2027-01-14', 'active', 'RV'),
('cli-003', 'Ananya Reddy', 'ananya@designpulse.co', '+91 87654 32100', 'DesignPulse', 'ctr-002', 'A-03', 'hot-desk', '2026-03-01', '2026-08-31', 'active', 'AR'),
('cli-004', 'Vikram Joshi', 'vikram@startupbox.in', '+91 70128 99001', 'StartupBox', 'ctr-002', 'C-08', 'cabin', '2026-02-01', '2027-01-31', 'active', 'VJ'),
('cli-005', 'Sneha Patel', 'sneha.patel@finova.com', '+91 98765 11234', 'Finova Analytics', 'ctr-001', 'D-01', 'dedicated', '2025-09-01', '2026-08-31', 'active', 'SP')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.leads (id, name, email, phone, company, source, status, assigned_to, center_id, notes, value) VALUES
('ld-001', 'Harish Madhavan', 'harish@novachem.in', '+91 98123 45670', 'NovaChem Industries', 'website', 'new', 'Arjun Mehta', 'ctr-001', 'Interested in 10-seat cabin for R&D team.', 180000),
('ld-002', 'Swati Kulkarni', 'swati@blueocean.vc', '+91 77889 12345', 'BlueOcean Ventures', 'linkedin', 'contacted', 'Priya Nair', 'ctr-002', 'VC firm looking for flexi desks for portfolio founders.', 95000),
('ld-003', 'Arun Bakshi', 'arun.b@codecrafters.dev', '+91 81234 99887', 'CodeCrafters', 'referral', 'qualified', 'Arjun Mehta', 'ctr-001', 'Needs 5 dedicated desks.', 125000),
('ld-004', 'Nandini Rao', 'nandini@ecovista.in', '+91 99012 34567', 'EcoVista Consulting', 'walkin', 'proposal', 'Deepak Shetty', 'ctr-003', 'Wants meeting room access + 3 hot desks.', 72000),
('ld-005', 'Rajat Kapoor', 'rajat@kapoorlaw.com', '+91 90098 76543', 'Kapoor & Associates', 'google', 'negotiation', 'Priya Nair', 'ctr-004', 'Law firm needs private cabin in Whitefield.', 210000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.bookings (id, client_id, client_name, center_id, center_name, seat_id, seat_number, plan, start_date, end_date, amount) VALUES
('bk-001', 'cli-001', 'Priya Sharma', 'ctr-001', 'NexDesk Indiranagar', 'seat-012', 'A-12', 'dedicated', '2025-11-01', '2026-10-31', 15000),
('bk-002', 'cli-002', 'Rahul Verma', 'ctr-001', 'NexDesk Indiranagar', 'seat-025', 'B-05', 'cabin', '2026-01-15', '2027-01-14', 35000),
('bk-003', 'cli-003', 'Ananya Reddy', 'ctr-002', 'NexDesk Koramangala', 'seat-043', 'A-03', 'hot-desk', '2026-03-01', '2026-08-31', 8000),
('bk-004', 'cli-004', 'Vikram Joshi', 'ctr-002', 'NexDesk Koramangala', 'seat-058', 'C-08', 'cabin', '2026-02-01', '2027-01-31', 32000),
('bk-005', 'cli-005', 'Sneha Patel', 'ctr-001', 'NexDesk Indiranagar', 'seat-031', 'D-01', 'dedicated', '2025-09-01', '2026-08-31', 15000)
ON CONFLICT (id) DO NOTHING;

-- Populate all 80 seats
DO $$
DECLARE
    z text;
    f integer;
    i integer;
    s_count integer;
    s_id text;
    s_num text;
    s_type text;
    s_status text;
    c_name text;
    c_id text;
BEGIN
    FOR c_id IN SELECT id FROM public.centers LOOP
        FOR f IN 1..3 LOOP
            FOR z IN SELECT unnest(ARRAY['A', 'B', 'C', 'D']) LOOP
                s_count := CASE WHEN z = 'A' THEN 8 WHEN z = 'B' THEN 6 WHEN z = 'C' THEN 5 ELSE 4 END;
                FOR i IN 1..s_count LOOP
                    s_num := z || f || lpad(i::text, 2, '0');
                    s_id := c_id || '-' || f || '-' || s_num;
                    s_type := CASE WHEN z = 'D' THEN 'meeting' WHEN i <= 2 AND z = 'C' THEN 'cabin' ELSE 'desk' END;
                    
                    s_status := 'available';
                    c_name := NULL;
                    
                    -- Assign a few static occupants to match seed bookings
                    IF c_id = 'ctr-001' AND s_num = 'A112' THEN
                        s_status := 'occupied';
                        c_name := 'Priya Sharma';
                    ELSIF c_id = 'ctr-001' AND s_num = 'B105' THEN
                        s_status := 'occupied';
                        c_name := 'Rahul Verma';
                    ELSIF c_id = 'ctr-002' AND s_num = 'A103' THEN
                        s_status := 'occupied';
                        c_name := 'Ananya Reddy';
                    ELSIF c_id = 'ctr-002' AND s_num = 'C108' THEN
                        s_status := 'occupied';
                        c_name := 'Vikram Joshi';
                    ELSIF c_id = 'ctr-001' AND s_num = 'D101' THEN
                        s_status := 'occupied';
                        c_name := 'Sneha Patel';
                    END IF;
                    
                    INSERT INTO public.seats (id, number, floor, zone, type, status, client_name, center_id)
                    VALUES (s_id, s_num, f, z, s_type, s_status, c_name, c_id)
                    ON CONFLICT (id) DO NOTHING;
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

INSERT INTO public.renewals (id, client_id, client_name, booking_id, center_id, center_name, plan, current_end_date, renewal_date, amount, status, days_until_expiry) VALUES
('ren-001', 'cli-001', 'Priya Sharma', 'bk-001', 'ctr-001', 'NexDesk Indiranagar', 'dedicated', '2026-10-31', '2026-11-01', 15000, 'upcoming', 158),
('ren-002', 'cli-002', 'Rahul Verma', 'bk-002', 'ctr-001', 'NexDesk Indiranagar', 'cabin', '2027-01-14', '2027-01-15', 35000, 'upcoming', 233),
('ren-003', 'cli-003', 'Ananya Reddy', 'bk-003', 'ctr-002', 'NexDesk Koramangala', 'hot-desk', '2026-08-31', '2026-09-01', 8000, 'upcoming', 97),
('ren-004', 'cli-004', 'Vikram Joshi', 'bk-004', 'ctr-002', 'NexDesk Koramangala', 'cabin', '2027-01-31', '2027-02-01', 32000, 'upcoming', 250),
('ren-005', 'cli-005', 'Sneha Patel', 'bk-005', 'ctr-001', 'NexDesk Indiranagar', 'dedicated', '2026-08-31', '2026-09-01', 15000, 'upcoming', 97)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.invoices (id, invoice_number, client_id, client_name, booking_id, center_id, center_name, amount, tax, total, status, issued_date, due_date, paid_date) VALUES
('inv-001', 'NXD-2026-1001', 'cli-001', 'Priya Sharma', 'bk-001', 'ctr-001', 'NexDesk Indiranagar', 15000, 2700, 17700, 'paid', '2026-05-01', '2026-05-15', '2026-05-05'),
('inv-002', 'NXD-2026-1002', 'cli-002', 'Rahul Verma', 'bk-002', 'ctr-001', 'NexDesk Indiranagar', 35000, 6300, 41300, 'paid', '2026-05-01', '2026-05-15', '2026-05-06'),
('inv-003', 'NXD-2026-1003', 'cli-003', 'Ananya Reddy', 'bk-003', 'ctr-002', 'NexDesk Koramangala', 8000, 1440, 9440, 'sent', '2026-05-20', '2026-06-03', NULL),
('inv-004', 'NXD-2026-1004', 'cli-004', 'Vikram Joshi', 'bk-004', 'ctr-002', 'NexDesk Koramangala', 32000, 5760, 37760, 'overdue', '2026-04-15', '2026-04-30', NULL),
('inv-005', 'NXD-2026-1005', 'cli-005', 'Sneha Patel', 'bk-005', 'ctr-001', 'NexDesk Indiranagar', 15000, 2700, 17700, 'draft', '2026-05-26', '2026-06-10', NULL)
ON CONFLICT (id) DO NOTHING;
