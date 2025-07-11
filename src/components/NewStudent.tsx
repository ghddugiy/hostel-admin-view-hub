
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NewStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    year: '',
    room_number: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if email already exists
      if (formData.email) {
        const { data: existingStudent } = await supabase
          .from('students')
          .select('id')
          .eq('email', formData.email)
          .single();

        if (existingStudent) {
          toast({
            title: "Error",
            description: "A student with this email already exists",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      const studentData = {
        name: formData.name,
        course: formData.course,
        year: parseInt(formData.year),
        room_number: formData.room_number ? parseInt(formData.room_number) : null,
        email: formData.email || null,
        phone: formData.phone || null
      };

      const { error } = await supabase
        .from('students')
        .insert([studentData]);

      if (error) {
        console.error('Database error:', error);
        
        // Handle specific database errors
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Error",
            description: "A student with this email already exists",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add student. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      toast({
        title: "Success",
        description: "Student added successfully"
      });

      setFormData({
        name: '',
        course: '',
        year: '',
        room_number: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/231da21c-6988-4a6f-8f80-6bf357cd015e.png)' }}
    >
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Add New Student</h1>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="mr-2" />
                Student Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="course">Course *</Label>
                    <Input
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="room_number">Room Number</Label>
                    <Input
                      id="room_number"
                      name="room_number"
                      type="number"
                      value={formData.room_number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="student@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Adding Student...' : 'Add Student'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewStudent;
