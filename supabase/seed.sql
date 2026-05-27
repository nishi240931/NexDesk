-- 1. Seed Centers (4 rows)
INSERT INTO public.centers (id, name, address, city, total_seats, occupied_seats, revenue, status) VALUES
('ctr-001', 'NexDesk Indiranagar', '312, 100 Feet Road, Indiranagar', 'Bangalore', 120, 98, 2450000, 'active'),
('ctr-002', 'NexDesk Koramangala', '45, 5th Block, Koramangala', 'Bangalore', 80, 72, 1820000, 'active'),
('ctr-003', 'NexDesk HSR Layout', 'Sector 2, 27th Main, HSR Layout', 'Bangalore', 60, 41, 980000, 'active'),
('ctr-004', 'NexDesk Whitefield', 'ITPL Main Road, Whitefield', 'Bangalore', 100, 65, 1560000, 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address, city = EXCLUDED.city, total_seats = EXCLUDED.total_seats, occupied_seats = EXCLUDED.occupied_seats, revenue = EXCLUDED.revenue, status = EXCLUDED.status;

-- 2. Seed Clients (10 rows)
INSERT INTO public.clients (id, name, email, phone, company, center_id, seat_number, plan, start_date, end_date, status, avatar) VALUES
('cli-001', 'Priya Sharma', 'priya.sharma@techlabs.in', '+91 98451 23456', 'TechLabs India', 'ctr-001', 'A101', 'dedicated', '2025-11-01', '2026-10-31', 'active', 'PS'),
('cli-002', 'Rahul Verma', 'rahul.v@cloudnine.io', '+91 99001 45678', 'CloudNine Solutions', 'ctr-001', 'B107', 'cabin', '2026-01-15', '2027-01-14', 'active', 'RV'),
('cli-003', 'Ananya Reddy', 'ananya@designpulse.co', '+91 87654 32100', 'DesignPulse', 'ctr-002', 'A101', 'hot-desk', '2026-03-01', '2026-08-31', 'active', 'AR'),
('cli-004', 'Vikram Joshi', 'vikram@startupbox.in', '+91 70128 99001', 'StartupBox', 'ctr-002', 'C213', 'cabin', '2026-02-01', '2027-01-31', 'active', 'VJ'),
('cli-005', 'Sneha Patel', 'sneha.patel@finova.com', '+91 98765 11234', 'Finova Analytics', 'ctr-001', 'C214', 'dedicated', '2025-09-01', '2026-08-31', 'active', 'SP'),
('cli-006', 'Arjun Mehta', 'arjun.mehta@nexus.io', '+91 99887 66554', 'Nexus Technologies', 'ctr-003', 'A102', 'dedicated', '2026-04-01', '2026-10-31', 'active', 'AM'),
('cli-007', 'Kavya Nair', 'kavya.nair@pixelstudios.com', '+91 98765 44321', 'Pixel Studios', 'ctr-003', 'C213', 'cabin', '2026-03-15', '2026-09-14', 'active', 'KN'),
('cli-008', 'Rohan Gupta', 'rohan.gupta@greenleaf.ai', '+91 88990 11223', 'GreenLeaf AI', 'ctr-004', 'A101', 'hot-desk', '2026-05-01', '2026-11-30', 'active', 'RG'),
('cli-009', 'Deepika Rao', 'deepika@pinnacle.design', '+91 77665 44332', 'Pinnacle Designs', 'ctr-004', 'B108', 'dedicated', '2026-02-01', '2026-08-31', 'active', 'DR'),
('cli-010', 'Sanjay Dutt', 'sanjay@crestview.cap', '+91 90001 22334', 'CrestView Capital', 'ctr-004', 'D320', 'meeting-room', '2026-05-10', '2026-06-09', 'active', 'SD')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, company = EXCLUDED.company, center_id = EXCLUDED.center_id, seat_number = EXCLUDED.seat_number, plan = EXCLUDED.plan, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, status = EXCLUDED.status, avatar = EXCLUDED.avatar;

-- 3. Seed Leads (15 rows)
INSERT INTO public.leads (id, name, email, phone, company, source, status, assigned_to, center_id, notes, value) VALUES
('ld-001', 'Harish Madhavan', 'harish@novachem.in', '+91 98123 45670', 'NovaChem Industries', 'website', 'new', 'Arjun Mehta', 'ctr-001', 'Interested in 10-seat cabin for R&D team.', 180000),
('ld-002', 'Swati Kulkarni', 'swati@blueocean.vc', '+91 77889 12345', 'BlueOcean Ventures', 'linkedin', 'contacted', 'Priya Nair', 'ctr-002', 'VC firm looking for flexi desks for portfolio founders.', 95000),
('ld-003', 'Arun Bakshi', 'arun.b@codecrafters.dev', '+91 81234 99887', 'CodeCrafters', 'referral', 'qualified', 'Arjun Mehta', 'ctr-001', 'Needs 5 dedicated desks.', 125000),
('ld-004', 'Nandini Rao', 'nandini@ecovista.in', '+91 99012 34567', 'EcoVista Consulting', 'walkin', 'proposal', 'Deepak Shetty', 'ctr-003', 'Wants meeting room access + 3 hot desks.', 72000),
('ld-005', 'Rajat Kapoor', 'rajat@kapoorlaw.com', '+91 90098 76543', 'Kapoor & Associates', 'google', 'negotiation', 'Priya Nair', 'ctr-004', 'Law firm needs private cabin in Whitefield.', 210000),
('ld-006', 'Amit Sen', 'amit@apexcorp.com', '+91 99881 22334', 'Apex Corp', 'website', 'new', 'Arjun Mehta', 'ctr-001', 'Looking for 15 dedicated desks.', 250000),
('ld-007', 'Pooja Hegde', 'pooja@designspace.in', '+91 88776 65544', 'Design Space', 'linkedin', 'contacted', 'Priya Nair', 'ctr-002', 'Startup requests private cabins.', 180000),
('ld-008', 'Karthik S', 'karthik@cloudstack.io', '+91 77661 12233', 'CloudStack Solutions', 'google', 'qualified', 'Deepak Shetty', 'ctr-003', 'Needs HSR Layout seat options.', 85000),
('ld-009', 'Meera Nair', 'meera@quantum.ai', '+91 90901 22334', 'Quantum AI', 'referral', 'proposal', 'Arjun Mehta', 'ctr-001', 'Requests 4 cabins.', 240000),
('ld-010', 'Rohit Bansal', 'rohit@mintroute.in', '+91 81234 55443', 'MintRoute Logistics', 'walkin', 'negotiation', 'Priya Nair', 'ctr-004', 'Wants long term dedicated desks.', 150000),
('ld-011', 'Lakshmi Pillai', 'lakshmi@infra.co', '+91 99002 33445', 'Infra Dynamics', 'website', 'won', 'Arjun Mehta', 'ctr-001', 'Converted successfully.', 120000),
('ld-012', 'Nitin Kamath', 'nitin@zerodha.com', '+91 98881 22334', 'Zerodha', 'referral', 'lost', 'Deepak Shetty', 'ctr-003', 'Lost to competitor.', 300000),
('ld-013', 'Divya C', 'divya@pixelstudios.com', '+91 77664 43322', 'Pixel Studios', 'linkedin', 'new', 'Priya Nair', 'ctr-002', 'Wants price lists.', 60000),
('ld-014', 'Varun K', 'varun@greenleaf.ai', '+91 88991 12233', 'GreenLeaf AI', 'website', 'contacted', 'Deepak Shetty', 'ctr-003', 'Sent pricing sheet.', 50000),
('ld-015', 'Ritu A', 'ritu@pinnacle.design', '+91 90001 44556', 'Pinnacle Designs', 'google', 'qualified', 'Priya Nair', 'ctr-004', 'Looking for virtual office.', 40000)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, company = EXCLUDED.company, source = EXCLUDED.source, status = EXCLUDED.status, assigned_to = EXCLUDED.assigned_to, center_id = EXCLUDED.center_id, notes = EXCLUDED.notes, value = EXCLUDED.value;

-- 4. Seed Bookings (10 rows)
INSERT INTO public.bookings (id, client_id, client_name, center_id, center_name, seat_id, seat_number, plan, start_date, end_date, amount, status) VALUES
('bk-001', 'cli-001', 'Priya Sharma', 'ctr-001', 'NexDesk Indiranagar', 'ctr-001-1-A101', 'A101', 'dedicated', '2025-11-01', '2026-10-31', 15000, 'confirmed'),
('bk-002', 'cli-002', 'Rahul Verma', 'ctr-001', 'NexDesk Indiranagar', 'ctr-001-1-B107', 'B107', 'cabin', '2026-01-15', '2027-01-14', 35000, 'confirmed'),
('bk-003', 'cli-003', 'Ananya Reddy', 'ctr-002', 'NexDesk Koramangala', 'ctr-002-1-A101', 'A101', 'hot-desk', '2026-03-01', '2026-08-31', 8000, 'confirmed'),
('bk-004', 'cli-004', 'Vikram Joshi', 'ctr-002', 'NexDesk Koramangala', 'ctr-002-2-C213', 'C213', 'cabin', '2026-02-01', '2027-01-31', 32000, 'confirmed'),
('bk-005', 'cli-005', 'Sneha Patel', 'ctr-001', 'NexDesk Indiranagar', 'ctr-001-2-C214', 'C214', 'dedicated', '2025-09-01', '2026-08-31', 15000, 'confirmed'),
('bk-006', 'cli-006', 'Arjun Mehta', 'ctr-003', 'NexDesk HSR Layout', 'ctr-003-1-A102', 'A102', 'dedicated', '2026-04-01', '2026-10-31', 12000, 'confirmed'),
('bk-007', 'cli-007', 'Kavya Nair', 'ctr-003', 'NexDesk HSR Layout', 'ctr-003-2-C213', 'C213', 'cabin', '2026-03-15', '2026-09-14', 28000, 'confirmed'),
('bk-008', 'cli-008', 'Rohan Gupta', 'ctr-004', 'NexDesk Whitefield', 'ctr-004-1-A101', 'A101', 'hot-desk', '2026-05-01', '2026-11-30', 9000, 'pending'),
('bk-009', 'cli-009', 'Deepika Rao', 'ctr-004', 'NexDesk Whitefield', 'ctr-004-1-B108', 'B108', 'dedicated', '2026-02-01', '2026-08-31', 14000, 'confirmed'),
('bk-010', 'cli-010', 'Sanjay Dutt', 'ctr-004', 'NexDesk Whitefield', 'ctr-004-3-D320', 'D320', 'meeting-room', '2026-05-10', '2026-06-09', 6000, 'cancelled')
ON CONFLICT (id) DO UPDATE SET client_id = EXCLUDED.client_id, client_name = EXCLUDED.client_name, center_id = EXCLUDED.center_id, center_name = EXCLUDED.center_name, seat_id = EXCLUDED.seat_id, seat_number = EXCLUDED.seat_number, plan = EXCLUDED.plan, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, amount = EXCLUDED.amount, status = EXCLUDED.status;

-- 5. Seed Seats (80 rows exactly - 20 seats per center)
DO $$
DECLARE
    c_id text;
    i integer;
    s_num text;
    s_id text;
    s_type text;
    s_status text;
    c_name text;
    s_zone text;
    s_floor integer;
BEGIN
    FOR c_id IN SELECT id FROM public.centers LOOP
        FOR i IN 1..20 LOOP
            s_floor := CASE WHEN i <= 8 THEN 1 WHEN i <= 15 THEN 2 ELSE 3 END;
            s_zone := CASE WHEN i <= 6 THEN 'A' WHEN i <= 12 THEN 'B' WHEN i <= 16 THEN 'C' ELSE 'D' END;
            s_num := s_zone || s_floor || lpad(i::text, 2, '0');
            s_id := c_id || '-' || s_floor || '-' || s_num;
            s_type := CASE WHEN s_zone = 'D' THEN 'meeting' WHEN s_zone = 'C' THEN 'cabin' ELSE 'desk' END;
            
            s_status := 'available';
            c_name := NULL;
            
            -- Assign static occupants to match seeded clients
            IF c_id = 'ctr-001' AND i = 1 THEN
                s_status := 'occupied';
                c_name := 'Priya Sharma';
            ELSIF c_id = 'ctr-001' AND i = 7 THEN
                s_status := 'occupied';
                c_name := 'Rahul Verma';
            ELSIF c_id = 'ctr-002' AND i = 1 THEN
                s_status := 'occupied';
                c_name := 'Ananya Reddy';
            ELSIF c_id = 'ctr-002' AND i = 13 THEN
                s_status := 'occupied';
                c_name := 'Vikram Joshi';
            ELSIF c_id = 'ctr-001' AND i = 14 THEN
                s_status := 'occupied';
                c_name := 'Sneha Patel';
            ELSIF c_id = 'ctr-003' AND i = 2 THEN
                s_status := 'occupied';
                c_name := 'Arjun Mehta';
            ELSIF c_id = 'ctr-003' AND i = 13 THEN
                s_status := 'occupied';
                c_name := 'Kavya Nair';
            ELSIF c_id = 'ctr-004' AND i = 1 THEN
                s_status := 'reserved';
                c_name := 'Rohan Gupta';
            ELSIF c_id = 'ctr-004' AND i = 8 THEN
                s_status := 'occupied';
                c_name := 'Deepika Rao';
            END IF;
            
            INSERT INTO public.seats (id, number, floor, zone, type, status, client_name, center_id)
            VALUES (s_id, s_num, s_floor, s_zone, s_type, s_status, c_name, c_id)
            ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, client_name = EXCLUDED.client_name;
        END LOOP;
    END LOOP;
END $$;

-- 6. Seed Renewals (8 rows)
INSERT INTO public.renewals (id, client_id, client_name, booking_id, center_id, center_name, plan, current_end_date, renewal_date, amount, status, days_until_expiry) VALUES
('ren-001', 'cli-001', 'Priya Sharma', 'bk-001', 'ctr-001', 'NexDesk Indiranagar', 'dedicated', '2026-10-31', '2026-11-01', 15000, 'upcoming', 158),
('ren-002', 'cli-002', 'Rahul Verma', 'bk-002', 'ctr-001', 'NexDesk Indiranagar', 'cabin', '2027-01-14', '2027-01-15', 35000, 'upcoming', 233),
('ren-003', 'cli-003', 'Ananya Reddy', 'bk-003', 'ctr-002', 'NexDesk Koramangala', 'hot-desk', '2026-08-31', '2026-09-01', 8000, 'upcoming', 97),
('ren-004', 'cli-004', 'Vikram Joshi', 'bk-004', 'ctr-002', 'NexDesk Koramangala', 'cabin', '2027-01-31', '2027-02-01', 32000, 'upcoming', 250),
('ren-005', 'cli-005', 'Sneha Patel', 'bk-005', 'ctr-001', 'NexDesk Indiranagar', 'dedicated', '2026-08-31', '2026-09-01', 15000, 'upcoming', 97),
('ren-006', 'cli-006', 'Arjun Mehta', 'bk-006', 'ctr-003', 'NexDesk HSR Layout', 'dedicated', '2026-10-31', '2026-11-01', 12000, 'due', 4),
('ren-007', 'cli-007', 'Kavya Nair', 'bk-007', 'ctr-003', 'NexDesk HSR Layout', 'cabin', '2026-09-14', '2026-09-15', 28000, 'upcoming', 110),
('ren-008', 'cli-009', 'Deepika Rao', 'bk-009', 'ctr-004', 'NexDesk Whitefield', 'dedicated', '2026-08-31', '2026-09-01', 14000, 'expired', -5)
ON CONFLICT (id) DO UPDATE SET client_id = EXCLUDED.client_id, client_name = EXCLUDED.client_name, booking_id = EXCLUDED.booking_id, center_id = EXCLUDED.center_id, center_name = EXCLUDED.center_name, plan = EXCLUDED.plan, current_end_date = EXCLUDED.current_end_date, renewal_date = EXCLUDED.renewal_date, amount = EXCLUDED.amount, status = EXCLUDED.status, days_until_expiry = EXCLUDED.days_until_expiry;

-- 7. Seed Invoices (10 rows)
INSERT INTO public.invoices (id, invoice_number, client_id, client_name, booking_id, center_id, center_name, amount, tax, total, status, issued_date, due_date, paid_date) VALUES
('inv-001', 'NXD-2026-1001', 'cli-001', 'Priya Sharma', 'bk-001', 'ctr-001', 'NexDesk Indiranagar', 15000, 2700, 17700, 'paid', '2026-05-01', '2026-05-15', '2026-05-05'),
('inv-002', 'NXD-2026-1002', 'cli-002', 'Rahul Verma', 'bk-002', 'ctr-001', 'NexDesk Indiranagar', 35000, 6300, 41300, 'paid', '2026-05-01', '2026-05-15', '2026-05-06'),
('inv-003', 'NXD-2026-1003', 'cli-003', 'Ananya Reddy', 'bk-003', 'ctr-002', 'NexDesk Koramangala', 8000, 1440, 9440, 'sent', '2026-05-20', '2026-06-03', NULL),
('inv-004', 'NXD-2026-1004', 'cli-004', 'Vikram Joshi', 'bk-004', 'ctr-002', 'NexDesk Koramangala', 32000, 5760, 37760, 'overdue', '2026-04-15', '2026-04-30', NULL),
('inv-005', 'NXD-2026-1005', 'cli-005', 'Sneha Patel', 'bk-005', 'ctr-001', 'NexDesk Indiranagar', 15000, 2700, 17700, 'draft', '2026-05-26', '2026-06-10', NULL),
('inv-006', 'NXD-2026-1006', 'cli-006', 'Arjun Mehta', 'bk-006', 'ctr-003', 'NexDesk HSR Layout', 12000, 2160, 14160, 'paid', '2026-05-01', '2026-05-15', '2026-05-05'),
('inv-007', 'NXD-2026-1007', 'cli-007', 'Kavya Nair', 'bk-007', 'ctr-003', 'NexDesk HSR Layout', 28000, 5040, 33040, 'sent', '2026-05-15', '2026-05-30', NULL),
('inv-008', 'NXD-2026-1008', 'cli-008', 'Rohan Gupta', 'bk-008', 'ctr-004', 'NexDesk Whitefield', 9000, 1620, 10620, 'draft', '2026-05-25', '2026-06-09', NULL),
('inv-009', 'NXD-2026-1009', 'cli-009', 'Deepika Rao', 'bk-009', 'ctr-004', 'NexDesk Whitefield', 14000, 2520, 16520, 'paid', '2026-05-05', '2026-05-20', '2026-05-10'),
('inv-010', 'NXD-2026-1010', 'cli-010', 'Sanjay Dutt', 'bk-010', 'ctr-004', 'NexDesk Whitefield', 6000, 1080, 7080, 'cancelled', '2026-05-10', '2026-05-25', NULL)
ON CONFLICT (id) DO UPDATE SET invoice_number = EXCLUDED.invoice_number, client_id = EXCLUDED.client_id, client_name = EXCLUDED.client_name, booking_id = EXCLUDED.booking_id, center_id = EXCLUDED.center_id, center_name = EXCLUDED.center_name, amount = EXCLUDED.amount, tax = EXCLUDED.tax, total = EXCLUDED.total, status = EXCLUDED.status, issued_date = EXCLUDED.issued_date, due_date = EXCLUDED.due_date, paid_date = EXCLUDED.paid_date;
