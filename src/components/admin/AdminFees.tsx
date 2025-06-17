
import React, { useEffect } from 'react';
import PaymentStats from './fees/PaymentStats';
import FeeTable from './fees/FeeTable';
import { useFees } from './fees/useFees';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AdminFees = () => {
  const { fees, paymentStats, handleMarkAsPaid, refreshFees } = useFees();

  // Force refresh function for manual updates
  const handleRefresh = () => {
    console.log('Manual refresh triggered by admin');
    refreshFees();
  };

  useEffect(() => {
    console.log('AdminFees component mounted, current fees count:', fees.length);
    console.log('Recent fees:', fees.slice(0, 2));
    // Auto-refresh when component mounts to ensure fresh data
    const timeoutId = setTimeout(() => {
      refreshFees();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fee Management</h2>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>
      
      <PaymentStats
        totalPaid={paymentStats.totalPaid}
        totalPending={paymentStats.totalPending}
        totalAmount={paymentStats.totalAmount}
      />
      
      <FeeTable fees={fees} onMarkAsPaid={handleMarkAsPaid} />
      
      {fees.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No fee records found.</p>
          <p className="text-sm mt-2">Stripe payments will appear here automatically after verification.</p>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Check for New Payments
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminFees;
