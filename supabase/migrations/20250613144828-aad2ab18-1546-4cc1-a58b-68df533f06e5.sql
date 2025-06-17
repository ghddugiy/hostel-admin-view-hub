
-- Create enum types for better data integrity
CREATE TYPE public.member_role AS ENUM ('admin', 'staff', 'manager', 'warden');
CREATE TYPE public.complaint_status AS ENUM ('pending', 'in_progress', 'resolved');
CREATE TYPE public.room_status AS ENUM ('available', 'occupied', 'maintenance');

-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role member_role NOT NULL DEFAULT 'staff',
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  room_number INTEGER,
  year INTEGER NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number INTEGER UNIQUE NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  status room_status NOT NULL DEFAULT 'available',
  floor INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status complaint_status NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create fees table
CREATE TABLE public.fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  amount DECIMAL(10,2) NOT NULL,
  fee_type TEXT NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're handling admin auth in the app)
CREATE POLICY "Allow all operations" ON public.members FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.complaints FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.fees FOR ALL USING (true);

-- Enable realtime for all tables
ALTER TABLE public.members REPLICA IDENTITY FULL;
ALTER TABLE public.students REPLICA IDENTITY FULL;
ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.complaints REPLICA IDENTITY FULL;
ALTER TABLE public.fees REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fees;

-- Insert some sample data
INSERT INTO public.rooms (room_number, capacity, current_occupancy, status, floor) VALUES
(101, 2, 1, 'occupied', 1),
(102, 2, 0, 'available', 1),
(103, 3, 2, 'occupied', 1),
(201, 2, 2, 'occupied', 2),
(202, 2, 0, 'available', 2),
(203, 3, 0, 'maintenance', 2);

INSERT INTO public.members (name, role, email) VALUES
('John Admin', 'admin', 'admin@example.com'),
('Sarah Manager', 'manager', 'sarah@hostel.com'),
('Mike Warden', 'warden', 'mike@hostel.com');

INSERT INTO public.students (name, course, room_number, year, email, phone) VALUES
('Alice Johnson', 'Computer Science', 101, 2, 'alice@student.com', '123-456-7890'),
('Bob Smith', 'Engineering', 103, 3, 'bob@student.com', '234-567-8901'),
('Carol Davis', 'Business', 201, 1, 'carol@student.com', '345-678-9012');

INSERT INTO public.complaints (student_id, title, description, status, priority) VALUES
((SELECT id FROM public.students WHERE name = 'Alice Johnson'), 'AC Not Working', 'The air conditioning in room 101 is not functioning properly', 'pending', 'high'),
((SELECT id FROM public.students WHERE name = 'Bob Smith'), 'WiFi Issues', 'Internet connection is very slow in room 103', 'in_progress', 'medium'),
((SELECT id FROM public.students WHERE name = 'Carol Davis'), 'Broken Window', 'Window latch is broken in room 201', 'resolved', 'low');

INSERT INTO public.fees (student_id, amount, fee_type, due_date, status) VALUES
((SELECT id FROM public.students WHERE name = 'Alice Johnson'), 5000.00, 'Monthly Rent', '2024-02-01', 'paid'),
((SELECT id FROM public.students WHERE name = 'Bob Smith'), 5000.00, 'Monthly Rent', '2024-02-01', 'pending'),
((SELECT id FROM public.students WHERE name = 'Carol Davis'), 5000.00, 'Monthly Rent', '2024-02-01', 'pending');
