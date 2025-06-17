
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface AdminOverviewProps {
  stats: {
    totalStudents: number;
    totalMembers: number;
    activeComplaints: number;
    availableRooms: number;
    pendingFees: number;
  };
}

const AdminOverview = ({ stats }: AdminOverviewProps) => {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const { data: complaints } = await supabase
        .from('complaints')
        .select(`
          *,
          students (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: students } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      const activities = [
        ...(complaints || []).map(complaint => ({
          type: 'complaint',
          title: `New complaint: ${complaint.title}`,
          description: `From ${complaint.students?.name}`,
          time: new Date(complaint.created_at).toLocaleDateString()
        })),
        ...(students || []).map(student => ({
          type: 'student',
          title: `New student registered: ${student.name}`,
          description: `Room ${student.room_number} - ${student.course}`,
          time: new Date(student.created_at).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Students</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Staff Members</h3>
              <p className="text-2xl font-bold text-green-600">{stats.totalMembers}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800">Open Complaints</h3>
              <p className="text-2xl font-bold text-red-600">{stats.activeComplaints}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Available Rooms</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.availableRooms}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'complaint' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-gray-600 text-xs">{activity.description}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
