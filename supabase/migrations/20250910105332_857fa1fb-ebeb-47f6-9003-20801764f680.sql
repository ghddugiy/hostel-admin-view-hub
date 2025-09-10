-- Add student_id column to complaints table to link complaints with students
ALTER TABLE public.complaints 
ADD COLUMN student_id UUID REFERENCES public.students(id);

-- Add an index for better performance on student lookups
CREATE INDEX idx_complaints_student_id ON public.complaints(student_id);