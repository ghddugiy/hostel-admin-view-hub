
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, AlertCircle, Bed, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminOverview from './admin/AdminOverview';
import AdminMembers from './admin/AdminMembers';
import AdminStudents from './admin/AdminStudents';
import AdminComplaints from './admin/AdminComplaints';
import AdminFees from './admin/AdminFees';
import AdminLeaveManagement from './admin/AdminLeaveManagement';
import AdminLogin from './admin/AdminLogin';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMembers: 0,
    activeComplaints: 0,
    availableRooms: 0,
    pendingFees: 0,
    pendingLeaves: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      setupRealtimeSubscriptions();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const [studentsRes, membersRes, complaintsRes, roomsRes, feesRes, leavesRes] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact' }),
        supabase.from('members').select('*', { count: 'exact' }),
        supabase.from('complaints').select('*', { count: 'exact' }).neq('status', 'resolved'),
        supabase.from('rooms').select('*', { count: 'exact' }).eq('status', 'available'),
        supabase.from('fees').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('leave_requests').select('*', { count: 'exact' }).eq('status', 'pending_warden')
      ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        totalMembers: membersRes.count || 0,
        activeComplaints: complaintsRes.count || 0,
        availableRooms: roomsRes.count || 0,
        pendingFees: feesRes.count || 0,
        pendingLeaves: leavesRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fees' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_requests' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/231da21c-6988-4a6f-8f80-6bf357cd015e.png)' }}
    >
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10">
        <div className="bg-white/80 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-destructive hover:text-destructive/80 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card className="bg-white/95">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeComplaints}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                <Bed className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.availableRooms}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingFees}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/95">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6 bg-white/90">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="complaints">Complaints</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
              <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AdminOverview stats={stats} />
            </TabsContent>

            <TabsContent value="members">
              <AdminMembers />
            </TabsContent>

            <TabsContent value="students">
              <AdminStudents />
            </TabsContent>

            <TabsContent value="complaints">
              <AdminComplaints />
            </TabsContent>

            <TabsContent value="fees">
              <AdminFees />
            </TabsContent>

            <TabsContent value="leaves">
              <AdminLeaveManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
