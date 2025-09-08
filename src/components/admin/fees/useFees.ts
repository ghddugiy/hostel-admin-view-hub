
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculatePaymentStats } from './feeUtils';

export const useFees = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState({
    totalPaid: 0,
    totalPending: 0,
    totalAmount: 0
  });
  const { toast } = useToast();

  const fetchFees = async () => {
    try {
      console.log('Fetching fees data...');
      const { data, error } = await supabase
        .from('fees')
        .select(`
          *,
          students (name, room_number, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching fees:', error);
        throw error;
      }
      
      console.log('Fees data fetched:', data?.length, 'records');
      console.log('Latest fees:', data?.slice(0, 3));
      
      const validFees = data?.filter(fee => fee && fee.id) || [];
      setFees(validFees);
      
      const stats = calculatePaymentStats(validFees);
      setPaymentStats(stats);
      console.log('Payment stats calculated:', stats);
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fees",
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscription = () => {
    console.log('Setting up realtime subscription for fees...');
    const channel = supabase
      .channel('fees-admin-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'fees' 
      }, (payload) => {
        console.log('Fee record changed:', payload.eventType, payload);
        setTimeout(() => {
          fetchFees();
        }, 500);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'students' 
      }, (payload) => {
        console.log('Student data changed:', payload.eventType, payload);
        setTimeout(() => {
          fetchFees();
        }, 500);
      })
      .subscribe((status) => {
        console.log('Admin fees realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up admin fees realtime subscription');
      supabase.removeChannel(channel);
    };
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      console.log('Marking fee as paid:', id);
      const { error } = await supabase
        .from('fees')
        .update({ 
          status: 'paid',
          payment_status: 'paid',
          paid_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Fee marked as paid successfully"
      });
      
      fetchFees();
    } catch (error) {
      console.error('Error updating fee status:', error);
      toast({
        title: "Error",
        description: "Failed to update fee status",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('Initializing admin fees hook...');
    
    fetchFees();
    const cleanup = setupRealtimeSubscription();
    
    // Enhanced event listeners for immediate updates
    const handlePaymentVerified = (event: CustomEvent) => {
      console.log('Payment verified event received:', event.detail);
      toast({
        title: "💰 New Payment Received!",
        description: "A fee payment has been processed and recorded.",
      });
      setTimeout(() => {
        fetchFees();
      }, 1000);
    };

    const handleAdminRefresh = (event: CustomEvent) => {
      console.log('Admin refresh event received:', event.detail);
      fetchFees();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'payment-verified') {
        console.log('Payment verified in another tab, refreshing...');
        setTimeout(() => {
          fetchFees();
        }, 1000);
      }
    };
    
    // Set up event listeners
    window.addEventListener('payment-verified', handlePaymentVerified as EventListener);
    window.addEventListener('admin-fees-refresh', handleAdminRefresh as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    // Periodic refresh every 5 seconds for real-time updates
    const intervalId = setInterval(() => {
      console.log('Periodic refresh of admin fees data...');
      fetchFees();
    }, 5000);
    
    // Refresh when window gains focus
    const handleFocus = () => {
      console.log('Window focused, refreshing fees data...');
      fetchFees();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing fees data...');
        fetchFees();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      cleanup();
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('payment-verified', handlePaymentVerified as EventListener);
      window.removeEventListener('admin-fees-refresh', handleAdminRefresh as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    fees,
    paymentStats,
    handleMarkAsPaid,
    refreshFees: fetchFees
  };
};
