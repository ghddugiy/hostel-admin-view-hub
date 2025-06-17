
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchComplaints();
    setupRealtimeSubscription();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          students (name, room_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: "Error",
        description: "Failed to fetch complaints",
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('complaints-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
        fetchComplaints();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleResolve = async (id: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ 
          status: 'resolved' as ComplaintStatus,
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Complaint resolved successfully"
      });
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error resolving complaint:', error);
      toast({
        title: "Error",
        description: "Failed to resolve complaint",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: ComplaintStatus) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Complaint status updated successfully"
      });
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Complaints List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell>{complaint.students?.name || 'Unknown'}</TableCell>
                      <TableCell>{complaint.students?.room_number || 'N/A'}</TableCell>
                      <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                      <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                      <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {complaint.status !== 'resolved' && (
                            <Button
                              size="sm"
                              onClick={() => handleResolve(complaint.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedComplaint ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedComplaint.title}</h3>
                    <p className="text-gray-600">{selectedComplaint.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Student:</p>
                      <p>{selectedComplaint.students?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Room:</p>
                      <p>{selectedComplaint.students?.room_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Priority:</p>
                      {getPriorityBadge(selectedComplaint.priority)}
                    </div>
                    <div>
                      <p className="font-medium">Status:</p>
                      {getStatusBadge(selectedComplaint.status)}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">Submitted:</p>
                    <p>{new Date(selectedComplaint.created_at).toLocaleString()}</p>
                  </div>

                  {selectedComplaint.resolved_at && (
                    <div className="text-sm">
                      <p className="font-medium">Resolved:</p>
                      <p>{new Date(selectedComplaint.resolved_at).toLocaleString()}</p>
                    </div>
                  )}

                  {selectedComplaint.status !== 'resolved' && (
                    <div className="space-y-2">
                      <p className="font-medium">Update Status:</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateStatus(selectedComplaint.id, 'in_progress')}
                          disabled={selectedComplaint.status === 'in_progress'}
                        >
                          In Progress
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleResolve(selectedComplaint.id)}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Select a complaint to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;
