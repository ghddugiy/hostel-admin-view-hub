
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Clock, Users } from 'lucide-react';

const MessManagement = () => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const menuSchedule = {
    Monday: {
      breakfast: 'Idli, Sambar, Chutney',
      lunch: 'Rice, Dal, Vegetable Curry, Chapati',
      dinner: 'Fried Rice, Manchurian, Soup'
    },
    Tuesday: {
      breakfast: 'Poha, Tea/Coffee',
      lunch: 'Rice, Rasam, Dry Vegetable, Chapati',
      dinner: 'Chapati, Paneer Curry, Rice'
    },
    Wednesday: {
      breakfast: 'Upma, Coconut Chutney',
      lunch: 'Rice, Sambar, Vegetable Fry, Chapati',
      dinner: 'Biryani, Raita, Pickle'
    },
    Thursday: {
      breakfast: 'Dosa, Sambar, Chutney',
      lunch: 'Rice, Dal, Mixed Vegetable, Chapati',
      dinner: 'Chapati, Dal Fry, Rice'
    },
    Friday: {
      breakfast: 'Bread, Jam, Tea/Coffee',
      lunch: 'Rice, Fish Curry, Vegetable, Chapati',
      dinner: 'Fried Rice, Gobi Manchurian'
    },
    Saturday: {
      breakfast: 'Paratha, Curd, Pickle',
      lunch: 'Rice, Chicken Curry, Vegetable, Chapati',
      dinner: 'Noodles, Chili Chicken'
    },
    Sunday: {
      breakfast: 'Puri, Aloo Sabzi',
      lunch: 'Special Rice, Mutton Curry, Vegetable',
      dinner: 'Chapati, Paneer Masala, Rice'
    }
  };

  const messTimings = {
    breakfast: '7:30 AM - 9:30 AM',
    lunch: '12:00 PM - 2:00 PM',
    dinner: '7:00 PM - 9:00 PM'
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/231da21c-6988-4a6f-8f80-6bf357cd015e.png)' }}
    >
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mess Management</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2" />
                  Mess Timings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(messTimings).map(([meal, time]) => (
                  <div key={meal} className="flex justify-between items-center">
                    <span className="font-medium capitalize">{meal}:</span>
                    <Badge variant="outline">{time}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" />
                  Today's Menu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(menuSchedule[Object.keys(menuSchedule)[new Date().getDay() - 1] as keyof typeof menuSchedule] || menuSchedule.Monday).map(([meal, items]) => (
                  <div key={meal}>
                    <h4 className="font-medium capitalize mb-1">{meal}</h4>
                    <p className="text-sm text-gray-600">{items}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  View Full Menu
                </Button>
                <Button className="w-full" variant="outline">
                  Report Issue
                </Button>
                <Button className="w-full" variant="outline">
                  Special Requests
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>Weekly Menu Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(menuSchedule).map(([day, meals]) => (
                  <Card key={day} className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{day}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(meals).map(([meal, items]) => (
                        <div key={meal}>
                          <h5 className="font-medium capitalize text-sm">{meal}</h5>
                          <p className="text-xs text-gray-600">{items}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessManagement;
