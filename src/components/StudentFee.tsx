
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { usePaymentVerification } from './student-fee/usePaymentVerification';
import StudentFeeForm from './student-fee/StudentFeeForm';
import PaymentHandler from './student-fee/PaymentHandler';
import { FormData } from './student-fee/types';

const StudentFee = () => {
  const [formData, setFormData] = useState<FormData>({
    mobileNumber: '',
    name: '',
    email: '',
    roomNumber: '',
    month: '',
    amount: '',
    feeType: 'Monthly Rent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  usePaymentVerification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormReset = () => {
    setFormData({
      mobileNumber: '',
      name: '',
      email: '',
      roomNumber: '',
      month: '',
      amount: '',
      feeType: 'Monthly Rent'
    });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/231da21c-6988-4a6f-8f80-6bf357cd015e.png)' }}
    >
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Student Fee Management</h1>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2" />
                Fee Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <StudentFeeForm 
                  formData={formData}
                  onInputChange={handleInputChange}
                />

                <PaymentHandler
                  formData={formData}
                  isProcessingPayment={isProcessingPayment}
                  onPaymentStart={() => setIsProcessingPayment(true)}
                  onPaymentEnd={() => setIsProcessingPayment(false)}
                  isSubmitting={isSubmitting}
                  onSaveStart={() => setIsSubmitting(true)}
                  onSaveEnd={() => setIsSubmitting(false)}
                  onFormReset={handleFormReset}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentFee;
