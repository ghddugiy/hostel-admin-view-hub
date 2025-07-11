
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentVerification = () => {
  const { toast } = useToast();

  const verifyPayment = async (sessionId: string) => {
    try {
      console.log('=== PAYMENT VERIFICATION START ===');
      console.log('Session ID:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      console.log('Verify payment response:', { data, error });

      if (error) {
        console.error("Payment verification error:", error);
        toast({
          title: "Payment Verification Failed",
          description: "Payment was successful but failed to record the fee. Please contact support.",
          variant: "destructive"
        });
        return;
      }

      if (data && data.success) {
        console.log('Payment verification successful:', data);
        
        // Show success message immediately
        toast({
          title: "🎉 Payment Successful!",
          description: "Your payment has been processed successfully! Thank you for your payment.",
          duration: 5000,
        });
        
        // Trigger multiple refresh mechanisms for admin dashboards
        const refreshEvent = new CustomEvent('payment-verified', {
          detail: { 
            feeRecord: data.feeRecord,
            timestamp: Date.now(),
            sessionId: sessionId
          }
        });
        window.dispatchEvent(refreshEvent);
        
        // Cross-tab communication
        localStorage.setItem('payment-verified', JSON.stringify({
          timestamp: Date.now(),
          feeRecord: data.feeRecord,
          sessionId: sessionId
        }));
        
        // Additional broadcast for immediate admin refresh
        const adminRefreshEvent = new CustomEvent('admin-fees-refresh', {
          detail: { immediate: true, source: 'payment-verification' }
        });
        window.dispatchEvent(adminRefreshEvent);
        
        // Wait for database consistency, then reload
        setTimeout(() => {
          console.log('Reloading page to refresh all data...');
          window.location.reload();
        }, 3000);
      } else {
        console.error("Payment verification failed:", data);
        toast({
          title: "Payment Verification Failed",
          description: data?.message || "Failed to verify payment status.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Verification Error",
        description: "Failed to verify payment. Please contact support.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    
    console.log('=== PAYMENT STATUS CHECK ===');
    console.log('URL Parameters:', { paymentStatus, sessionId });
    console.log('Current URL:', window.location.href);
    
    if (paymentStatus === 'success' && sessionId) {
      console.log('✅ Payment success detected, starting verification...');
      verifyPayment(sessionId);
      
      // Clean up URL parameters after verification
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('payment');
        url.searchParams.delete('session_id');
        window.history.replaceState({}, document.title, url.pathname);
      }, 1000);
    } else if (paymentStatus === 'cancelled') {
      console.log('❌ Payment was cancelled');
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again.",
        variant: "destructive"
      });
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, document.title, url.pathname);
    } else {
      console.log('No payment status detected in URL');
    }
  }, [toast]);

  return { verifyPayment };
};
