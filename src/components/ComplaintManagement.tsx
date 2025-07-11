
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ComplaintManagement = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentNumber: '',
    roomNumber: '',
    title: '',
    priority: 'medium',
    complaintDetails: ''
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
      // First, try to find the student or create a new one
      let { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', formData.studentEmail)
        .single();

      let studentId = student?.id;

      if (!student) {
        // Create new student if not found
        const { data: newStudent, error: studentError } = await supabase
          .from('students')
          .insert([{
            name: formData.studentName,
            email: formData.studentEmail,
            phone: formData.studentNumber,
            room_number: formData.roomNumber ? parseInt(formData.roomNumber) : null,
            course: 'Not Specified',
            year: 1
          }])
          .select('id')
          .single();

        if (studentError) throw studentError;
        studentId = newStudent.id;
      }

      // Create the complaint
      const { error: complaintError } = await supabase
        .from('complaints')
        .insert([{
          student_id: studentId,
          title: formData.title,
          description: formData.complaintDetails,
          priority: formData.priority,
          status: 'pending'
        }]);

      if (complaintError) throw complaintError;

      toast({
        title: "Complaint Submitted Successfully",
        description: `Complaint "${formData.title}" has been recorded and will be addressed soon.`,
      });
      
      // Reset form
      setFormData({
        studentName: '',
        studentEmail: '',
        studentNumber: '',
        roomNumber: '',
        title: '',
        priority: 'medium',
        complaintDetails: ''
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
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
          <h1 className="text-3xl font-bold text-foreground mb-8">Complaint & Maintenance Management</h1>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2" />
                Submit Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="studentEmail">Student Email ID</Label>
                    <Input
                      id="studentEmail"
                      name="studentEmail"
                      type="email"
                      value={formData.studentEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="studentNumber">Student Number</Label>
                    <Input
                      id="studentNumber"
                      name="studentNumber"
                      type="tel"
                      value={formData.studentNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="title">Complaint Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Brief title for your complaint"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="complaintDetails">Complaint Details</Label>
                  <Textarea
                    id="complaintDetails"
                    name="complaintDetails"
                    value={formData.complaintDetails}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Please describe your complaint or maintenance request in detail..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;
