
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bed, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Room {
  id: string;
  room_number: number;
  capacity: number;
  current_occupancy: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number | null;
}

const ManageRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    room_number: '',
    capacity: '2',
    floor: '',
    status: 'available' as 'available' | 'occupied' | 'maintenance'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const roomData = {
        room_number: parseInt(formData.room_number),
        capacity: parseInt(formData.capacity),
        floor: formData.floor ? parseInt(formData.floor) : null,
        status: formData.status,
        current_occupancy: 0
      };

      if (editingId) {
        const { error } = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Room updated successfully"
        });
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert([roomData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Room added successfully"
        });
      }

      setFormData({
        room_number: '',
        capacity: '2',
        floor: '',
        status: 'available'
      });

      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      toast({
        title: "Error",
        description: "Failed to save room",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (room: Room) => {
    setFormData({
      room_number: room.room_number.toString(),
      capacity: room.capacity.toString(),
      floor: room.floor?.toString() || '',
      status: room.status
    });
    setEditingId(room.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Room deleted successfully"
      });

      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/231da21c-6988-4a6f-8f80-6bf357cd015e.png)' }}
    >
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Manage Rooms</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  {editingId ? 'Edit Room' : 'Add New Room'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="room_number">Room Number</Label>
                    <Input
                      id="room_number"
                      name="room_number"
                      type="number"
                      value={formData.room_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Select 
                      value={formData.capacity} 
                      onValueChange={(value) => handleSelectChange('capacity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Person</SelectItem>
                        <SelectItem value="2">2 Persons</SelectItem>
                        <SelectItem value="3">3 Persons</SelectItem>
                        <SelectItem value="4">4 Persons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      name="floor"
                      type="number"
                      value={formData.floor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : (editingId ? 'Update Room' : 'Add Room')}
                    </Button>
                    {editingId && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            room_number: '',
                            capacity: '2',
                            floor: '',
                            status: 'available'
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bed className="mr-2 h-5 w-5" />
                    Rooms List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room No.</TableHead>
                        <TableHead>Floor</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Occupancy</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.room_number}</TableCell>
                          <TableCell>{room.floor || 'N/A'}</TableCell>
                          <TableCell>{room.capacity}</TableCell>
                          <TableCell>{room.current_occupancy}/{room.capacity}</TableCell>
                          <TableCell>{getStatusBadge(room.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(room)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(room.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRooms;
