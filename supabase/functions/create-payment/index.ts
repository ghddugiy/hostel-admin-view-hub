import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Payment request received:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { amount, email, name, description, currency = 'inr', month, feeType = 'Monthly Rent' } = requestBody;

    if (!amount || !email) {
      console.error("Missing required fields:", { amount, email });
      throw new Error("Amount and email are required");
    }

    // Validate amount is a positive number
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error("Amount must be a valid positive number");
    }

    console.log("Processing payment for:", { email, amount: numericAmount, currency });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not found in environment");
      throw new Error("Stripe configuration error");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    console.log("Stripe initialized successfully");

    // Check if a Stripe customer record exists for this email
    console.log("Looking for existing customer with email:", email);
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      console.log("No existing customer found");
    }

    // Get the origin for redirect URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    console.log("Using origin:", origin);

    // Create a one-time payment session with INR currency
    const sessionConfig = {
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { 
              name: description || "Student Fee Payment",
              description: `Fee payment for ${name || 'student'}`
            },
            unit_amount: Math.round(numericAmount * 100), // Convert to paise (INR cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancelled`,
      metadata: {
        student_email: email,
        student_name: name || '',
        fee_amount: amount.toString(),
        currency: currency,
        fee_type: feeType,
        month: month || ''
      }
    };

    console.log("Creating Stripe session with config:", sessionConfig);
    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("Payment session created successfully:", session.id);
    console.log("Session URL:", session.url);

    return new Response(JSON.stringify({ 
      url: session.url, 
      sessionId: session.id,
      success: true 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-payment function:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      details: error.stack 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});