
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const NewStudent = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    permanentAddress: '',
    aadhaarNumber: '',
    roomNumber: '',
    course: '',
    year: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const studentData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.mobileNumber,
        room_number: formData.roomNumber ? parseInt(formData.roomNumber) : null,
        course: formData.course || 'Not Specified',
        year: formData.year ? parseInt(formData.year) : 1
      };

      const { error } = await supabase
        .from('students')
        .insert([studentData]);

      if (error) throw error;

      toast({
        title: "Student Added Successfully",
        description: `${formData.firstName} ${formData.lastName} has been registered.`,
      });
      
      // Reset form
      setFormData({
        mobileNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        permanentAddress: '',
        aadhaarNumber: '',
        roomNumber: '',
        course: '',
        year: ''
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Input
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="1-5"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                    <Input
                      id="aadhaarNumber"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      name="roomNumber"
                      type="number"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Textarea
                    id="permanentAddress"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
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
