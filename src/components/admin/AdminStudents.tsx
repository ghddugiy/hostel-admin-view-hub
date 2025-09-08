import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    room_number: '',
    year: '',
    email: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    setupRealtimeSubscription();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('students-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchStudents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check for duplicate email when adding new student or updating with different email
      if (formData.email) {
        const { data: existingStudent } = await supabase
          .from('students')
          .select('id')
          .eq('email', formData.email)
          .single();

        if (existingStudent && (!editingId || existingStudent.id !== editingId)) {
          toast({
            title: "Error",
            description: "A student with this email already exists",
            variant: "destructive"
          });
          return;
        }
      }

      const studentData = {
        name: formData.name,
        course: formData.course,
        room_number: formData.room_number || null,
        year: parseInt(formData.year),
        email: formData.email || null,
        phone: formData.phone || null
      };

      if (editingId) {
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', editingId);

        if (error) {
          console.error('Update error:', error);
          if (error.code === '23505') {
            toast({
              title: "Error",
              description: "A student with this email already exists",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to update student",
              variant: "destructive"
            });
          }
          return;
        }
        
        toast({
          title: "Success",
          description: "Student updated successfully"
        });
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('students')
          .insert([studentData]);

        if (error) {
          console.error('Insert error:', error);
          if (error.code === '23505') {
            toast({
              title: "Error",
              description: "A student with this email already exists",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to add student",
              variant: "destructive"
            });
          }
          return;
        }
        
        toast({
          title: "Success",
          description: "Student added successfully"
        });
      }

      setFormData({ name: '', course: '', room_number: '', year: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: "Failed to save student",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (student: any) => {
    setFormData({
      name: student.name,
      course: student.course,
      room_number: student.room_number?.toString() || '',
      year: student.year.toString(),
      email: student.email || '',
      phone: student.phone || ''
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Student deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', course: '', room_number: '', year: '', email: '', phone: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            {editingId ? 'Edit Student' : 'Add New Student'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="course">Course *</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="room_number">Room Number</Label>
                <Input
                  id="room_number"
                  value={formData.room_number}
                  onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                  placeholder="101"
                />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="1234567890"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Update Student' : 'Add Student'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.room_number || 'N/A'}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.email || 'N/A'}</TableCell>
                  <TableCell>{student.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudents;
