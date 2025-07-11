
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Calendar, Receipt } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MessManagement = () => {
  const weekMenu = [
    { day: 'Monday', breakfast: 'Poha, Tea', lunch: 'Dal Rice, Sabzi', dinner: 'Chapati, Dal, Rice' },
    { day: 'Tuesday', breakfast: 'Upma, Coffee', lunch: 'Rajma Rice, Salad', dinner: 'Roti, Sab ziDal' },
    { day: 'Wednesday', breakfast: 'Paratha, Tea', lunch: 'Chole Rice, Pickle', dinner: 'Chapati, Paneer, Rice' },
    { day: 'Thursday', breakfast: 'Idli, Sambar', lunch: 'Dal Rice, Aloo Sabzi', dinner: 'Roti, Dal, Rice' },
    { day: 'Friday', breakfast: 'Sandwich, Tea', lunch: 'Biryani, Raita', dinner: 'Chapati, Mixed Dal' },
    { day: 'Saturday', breakfast: 'Dosa, Chutney', lunch: 'Pulao, Curry', dinner: 'Roti, Sabzi, Rice' },
    { day: 'Sunday', breakfast: 'Puri Sabzi, Tea', lunch: 'Special Thali', dinner: 'Chapati, Dal, Sweet' },
  ];

  const bills = [
    { month: 'January 2024', amount: '₹3,500', status: 'Paid' },
    { month: 'February 2024', amount: '₹3,200', status: 'Paid' },
    { month: 'March 2024', amount: '₹3,800', status: 'Pending' },
    { month: 'April 2024', amount: '₹3,600', status: 'Due' },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/231da21c-6988-4a6f-8f80-6bf357cd015e.png)' }}
    >
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mess & Food Management</h1>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Weekly Menu */}
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" />
                  Weekly Mess Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Breakfast</TableHead>
                      <TableHead>Lunch</TableHead>
                      <TableHead>Dinner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weekMenu.map((day) => (
                      <TableRow key={day.day}>
                        <TableCell className="font-medium">{day.day}</TableCell>
                        <TableCell>{day.breakfast}</TableCell>
                        <TableCell>{day.lunch}</TableCell>
                        <TableCell>{day.dinner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Bills */}
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="mr-2" />
                  Mess Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.month}>
                        <TableCell className="font-medium">{bill.month}</TableCell>
                        <TableCell>{bill.amount}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            bill.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {bill.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Today's Special */}
          <Card className="mt-6 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UtensilsCrossed className="mr-2" />
                Today's Special Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Breakfast</h3>
                  <p className="text-muted-foreground">Aloo Paratha with Curd</p>
                  <p className="text-muted-foreground">Tea/Coffee</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Lunch</h3>
                  <p className="text-muted-foreground">Chicken Biryani</p>
                  <p className="text-muted-foreground">Raita & Pickle</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Dinner</h3>
                  <p className="text-muted-foreground">Dal Makhani with Rice</p>
                  <p className="text-muted-foreground">Mixed Vegetable Curry</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessManagement;
