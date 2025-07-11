
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([
    { id: 1, number: '101', isActive: true, capacity: 2, occupied: 1 },
    { id: 2, number: '102', isActive: true, capacity: 3, occupied: 3 },
    { id: 3, number: '103', isActive: false, capacity: 2, occupied: 0 },
    { id: 4, number: '201', isActive: true, capacity: 4, occupied: 2 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');

  const filteredRooms = rooms.filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addRoom = () => {
    if (newRoomNumber) {
      setRooms([...rooms, { 
        id: Date.now(), 
        number: newRoomNumber, 
        isActive: true, 
        capacity: 2, 
        occupied: 0 
      }]);
      setNewRoomNumber('');
    }
  };

  const toggleRoomStatus = (id: number) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, isActive: !room.isActive } : room
    ));
  };

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter(room => room.id !== id));
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

          {/* Add New Room */}
          <Card className="mb-6 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2" />
                Add New Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Room Number"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                />
                <Button onClick={addRoom} className="bg-blue-600 hover:bg-blue-700">
                  Add Room
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="mb-6 bg-white/95">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by room number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rooms List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Room {room.number}
                    <Switch
                      checked={room.isActive}
                      onCheckedChange={() => toggleRoomStatus(room.id)}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Capacity: {room.capacity}</p>
                    <p>Occupied: {room.occupied}</p>
                    <p>Status: {room.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteRoom(room.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRooms;
