
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest {
  id: string;
  student_name: string;
  student_email: string;
  student_room: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: 'pending_parent' | 'pending_warden' | 'approved' | 'rejected';
  created_at: string;
  approved_by: string | null;
}

const AdminLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaveRequests();
    setupRealtimeSubscription();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaveRequests(data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leave requests",
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('leave-requests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_requests' }, () => {
        fetchLeaveRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          status: 'approved',
          approved_by: 'Admin'
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Leave request approved successfully"
      });
    } catch (error) {
      console.error('Error approving leave request:', error);
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive"
      });
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          status: 'rejected',
          approved_by: 'Admin'
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Leave request declined successfully"
      });
    } catch (error) {
      console.error('Error declining leave request:', error);
      toast({
        title: "Error",
        description: "Failed to decline leave request",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending_parent: 'bg-yellow-100 text-yellow-800',
      pending_warden: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Leave Requests Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>From Date</TableHead>
                <TableHead>To Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.student_name}</TableCell>
                  <TableCell>{request.student_email}</TableCell>
                  <TableCell>{request.student_room}</TableCell>
                  <TableCell>{new Date(request.from_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(request.to_date).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate" title={request.reason}>
                    {request.reason}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {(request.status === 'pending_warden' || request.status === 'pending_parent') && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDecline(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                    {(request.status === 'approved' || request.status === 'rejected') && (
                      <span className="text-sm text-gray-500">
                        {request.status === 'approved' ? 'Approved' : 'Declined'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {leaveRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No leave requests found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeaveManagement;
