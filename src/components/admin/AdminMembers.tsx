
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Member, MemberFormData, MemberRole } from './types';
import MemberForm from './MemberForm';
import MembersList from './MembersList';

const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    role: 'staff',
    email: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
    setupRealtimeSubscription();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers((data || []).map(member => ({
        ...member,
        role: member.role as MemberRole
      })));
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('members-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('members')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Member updated successfully"
        });
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('members')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Member added successfully"
        });
      }

      setFormData({ name: '', role: 'staff', email: '' });
    } catch (error) {
      console.error('Error saving member:', error);
      toast({
        title: "Error",
        description: "Failed to save member",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email || ''
    });
    setEditingId(member.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Member deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', role: 'staff', email: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <MemberForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editingId={editingId}
        onCancel={handleCancel}
      />
      <MembersList
        members={members}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminMembers;
