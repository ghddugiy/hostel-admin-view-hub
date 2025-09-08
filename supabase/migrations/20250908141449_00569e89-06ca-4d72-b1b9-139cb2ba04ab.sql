-- Update fees table to match expected schema structure
ALTER TABLE public.fees 
ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(id),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS paid_date DATE;

-- Update existing records to have status from payment_status
UPDATE public.fees SET status = payment_status::text WHERE status IS NULL;