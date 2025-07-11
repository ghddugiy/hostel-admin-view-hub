
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Home, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  UtensilsCrossed,
  UserPlus,
  Bed
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const dashboardItems = [
    {
      title: 'Manage Rooms',
      description: 'View and manage hostel rooms',
      icon: Bed,
      action: () => onNavigate('rooms'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'New Student',
      description: 'Register new students',
      icon: UserPlus,
      action: () => onNavigate('students'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Student Fees',
      description: 'Manage student fee payments',
      icon: DollarSign,
      action: () => onNavigate('fees'),
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      title: 'Leave Management',
      description: 'Handle leave requests',
      icon: Calendar,
      action: () => onNavigate('leave'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Complaints',
      description: 'View and resolve complaints',
      icon: MessageSquare,
      action: () => onNavigate('complaints'),
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Mess Management',
      description: 'Manage mess and food services',
      icon: UtensilsCrossed,
      action: () => onNavigate('mess'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/231da21c-6988-4a6f-8f80-6bf357cd015e.png)' }}
    >
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Hostel Management Dashboard</h1>
            <p className="text-xl text-muted-foreground">Manage your hostel operations efficiently</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item, index) => (
              <Card key={index} className="bg-white/95 hover:bg-white/100 transition-all duration-200 hover:shadow-lg cursor-pointer" onClick={item.action}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <div className={`p-2 rounded-lg ${item.color} text-white mr-3`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <Button className={`w-full ${item.color} text-white`}>
                    Access {item.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Students:</span>
                    <span className="font-semibold">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Rooms:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Complaints:</span>
                    <span className="font-semibold">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  Room Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Occupied:</span>
                    <span className="font-semibold">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fees Collected:</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
