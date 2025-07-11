import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from './types';

interface PaymentHandlerProps {
  formData: FormData;
  isProcessingPayment: boolean;
  onPaymentStart: () => void;
  onPaymentEnd: () => void;
  isSubmitting: boolean;
  onSaveStart: () => void;
  onSaveEnd: () => void;
  onFormReset: () => void;
}

const PaymentHandler: React.FC<PaymentHandlerProps> = ({
  formData,
  isProcessingPayment,
  onPaymentStart,
  onPaymentEnd,
  isSubmitting,
  onSaveStart,
  onSaveEnd,
  onFormReset
}) => {
  const { toast } = useToast();

  const handlePayWithStripe = async () => {
    console.log("Starting Stripe payment process...");
    console.log("Form data:", formData);

    if (!formData.amount || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in email and amount fields",
        variant: "destructive"
      });
      return;
    }

    const numericAmount = parseFloat(formData.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    onPaymentStart();

    try {
      console.log("Calling create-payment function...");
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: formData.amount,
          email: formData.email,
          name: formData.name,
          description: `${formData.feeType} - ${formData.month || 'Fee Payment'}`,
          currency: 'inr',
          month: formData.month,
          feeType: formData.feeType
        }
      });

      console.log("Function response:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to create payment session");
      }

      if (!data) {
        throw new Error("No response from payment service");
      }

      if (data.error) {
        console.error("Payment service error:", data.error);
        throw new Error(data.error);
      }

      if (data.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        // Use window.location.href instead of window.open to stay in the same tab
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from payment service");
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create payment session. Please try again.",
        variant: "destructive"
      });
    } finally {
      onPaymentEnd();
    }
  };

  const handleSave = async () => {
    if (!formData.amount || !formData.month || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onSaveStart();

    try {
      let { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', formData.email)
        .single();

      let studentId = student?.id;

      if (!student && formData.name) {
        const { data: newStudent, error: studentError } = await supabase
          .from('students')
          .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.mobileNumber,
            room_number: formData.roomNumber ? parseInt(formData.roomNumber) : null,
            course: 'Not Specified',
            year: 1
          }])
          .select('id')
          .single();

        if (studentError) throw studentError;
        studentId = newStudent.id;
      }

      if (!studentId) {
        throw new Error('Student not found. Please provide student name to create a new record.');
      }

      const dueDate = new Date(formData.month + '-01');
      const { error: feeError } = await supabase
        .from('fees')
        .insert([{
          student_id: studentId,
          amount: parseFloat(formData.amount),
          fee_type: formData.feeType,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0]
        }]);

      if (feeError) throw feeError;

      toast({
        title: "Fee Record Saved",
        description: `Fee payment of ₹${formData.amount} for ${formData.name || 'student'} has been recorded. You can now proceed to payment if needed.`,
      });

      // Don't reset the form after saving - keep the data for potential payment
    } catch (error) {
      console.error('Error saving fee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save fee record. Please try again.",
        variant: "destructive"
      });
    } finally {
      onSaveEnd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button 
          onClick={handlePayWithStripe} 
          className="bg-blue-600 hover:bg-blue-700 flex-1"
          disabled={isProcessingPayment || !formData.amount || !formData.email}
        >
          {isProcessingPayment ? 'Processing...' : `Pay ₹${formData.amount || '0'} with Stripe`}
        </Button>
        <Button 
          onClick={handleSave} 
          className="bg-green-600 hover:bg-green-700 flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Record'}
        </Button>
      </div>
      
      <div className="flex gap-4">
        <Button 
          onClick={onFormReset} 
          variant="outline" 
          className="flex-1"
          disabled={isSubmitting || isProcessingPayment}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default PaymentHandler;
