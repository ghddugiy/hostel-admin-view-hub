
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== VERIFY PAYMENT FUNCTION START ===");
  console.log("Request method:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { sessionId } = requestBody;
    
    console.log("Session ID received:", sessionId);

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe configuration error - no secret key");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    console.log("Retrieving Stripe session...");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Stripe session retrieved:", {
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total
    });

    if (session.payment_status !== 'paid') {
      console.log("Payment not completed, status:", session.payment_status);
      return new Response(JSON.stringify({ 
        success: false,
        message: `Payment not completed. Status: ${session.payment_status}`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Supabase with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const metadata = session.metadata;
    const studentEmail = metadata?.student_email;
    const studentName = metadata?.student_name;
    const feeAmount = parseFloat(metadata?.fee_amount || '0');
    const feeType = metadata?.fee_type || 'Monthly Rent';
    const month = metadata?.month;

    console.log("Processing payment data:", {
      email: studentEmail,
      name: studentName,
      amount: feeAmount,
      feeType,
      month,
      sessionId
    });

    if (!studentEmail) {
      throw new Error('Student email is required from session metadata');
    }

    // Check for existing payment to prevent duplicates
    console.log("Checking for duplicate payments...");
    const { data: existingPayment, error: duplicateCheckError } = await supabase
      .from('fees')
      .select('id, amount, created_at, status, student_id')
      .eq('amount', feeAmount)
      .eq('status', 'paid')
      .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .maybeSingle();

    if (duplicateCheckError) {
      console.error('Error checking for duplicates:', duplicateCheckError);
    }

    // Find or create student
    console.log("Finding student by email:", studentEmail);
    let { data: student, error: studentFindError } = await supabase
      .from('students')
      .select('id, name, email, phone, room_number')
      .eq('email', studentEmail)
      .maybeSingle();

    if (studentFindError) {
      console.error('Error finding student:', studentFindError);
      throw studentFindError;
    }

    let studentId = student?.id;
    console.log("Found student:", student);

    if (!student && studentName) {
      console.log("Creating new student:", studentName, studentEmail);
      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert([{
          name: studentName,
          email: studentEmail,
          course: 'Not Specified',
          year: 1,
          phone: null,
          room_number: null
        }])
        .select('id, name, email, phone, room_number')
        .single();

      if (studentError) {
        console.error('Error creating student:', studentError);
        throw studentError;
      }
      studentId = newStudent.id;
      student = newStudent;
      console.log("Created new student with ID:", studentId, newStudent);
    }

    if (!studentId) {
      throw new Error('Student not found and name not provided to create new record');
    }

    // Check for exact duplicate with student ID
    if (existingPayment && existingPayment.student_id === studentId) {
      console.log("Exact duplicate payment detected, returning existing record:", existingPayment.id);
      return new Response(JSON.stringify({ 
        success: true,
        message: "Payment already recorded",
        feeId: existingPayment.id,
        feeRecord: {
          id: existingPayment.id,
          amount: existingPayment.amount,
          status: existingPayment.status,
          student_name: student?.name,
          student_email: studentEmail
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create the fee record
    const dueDate = month ? new Date(month + '-01') : new Date();
    const currentDate = new Date().toISOString().split('T')[0];
    
    const feeData = {
      student_id: studentId,
      amount: feeAmount,
      fee_type: feeType,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'paid',
      paid_date: currentDate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Creating fee record:", feeData);

    const { data: feeRecord, error: feeError } = await supabase
      .from('fees')
      .insert([feeData])
      .select(`
        *,
        students (name, room_number, email, phone)
      `)
      .single();

    if (feeError) {
      console.error('Error creating fee record:', feeError);
      throw feeError;
    }

    console.log("✅ Fee record created successfully:", feeRecord);
    
    // Wait for database consistency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify the record was created
    const { data: verifyRecord, error: verifyError } = await supabase
      .from('fees')
      .select(`
        *,
        students (name, room_number, email, phone)
      `)
      .eq('id', feeRecord.id)
      .single();
    
    if (verifyError) {
      console.error('Error verifying created record:', verifyError);
    } else {
      console.log("✅ Verified fee record exists:", verifyRecord);
    }
    
    console.log("=== VERIFY PAYMENT FUNCTION SUCCESS ===");

    return new Response(JSON.stringify({ 
      success: true,
      message: "Payment verified and fee record created successfully",
      feeRecord: {
        id: feeRecord.id,
        amount: feeRecord.amount,
        fee_type: feeRecord.fee_type,
        status: feeRecord.status,
        paid_date: feeRecord.paid_date,
        student_name: student?.name,
        student_email: studentEmail,
        created_at: feeRecord.created_at
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ ERROR in verify-payment function:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      details: "Check function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
