// Supabase Edge Function for verifying Paystack payments
// Deploy: supabase functions deploy verify-paystack-payment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()

    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Payment reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Paystack secret key
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Payment system not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔍 Verifying payment with Paystack:', reference)

    // Verify payment with Paystack API
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text()
      console.error('Paystack API error:', errorText)
      throw new Error('Payment verification request failed')
    }

    const verificationData = await verifyResponse.json()
    console.log('📊 Paystack response:', verificationData)

    // Check if payment was successful
    if (verificationData.status === true && verificationData.data.status === 'success') {
      const transaction = verificationData.data

      // Initialize Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Get user from metadata
      const userId = transaction.metadata?.user_id
      const planId = transaction.metadata?.plan_id
      const billingCycle = transaction.metadata?.billing_cycle || 'monthly'

      if (!userId || !planId) {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Invalid payment metadata - missing user_id or plan_id' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('👤 Processing payment for user:', userId, 'Plan:', planId)

      // Calculate subscription end date
      const subscriptionEndDate = new Date()
      if (billingCycle === 'yearly') {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1)
      } else {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)
      }

      // Update user's plan in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan: planId,
          subscription_end_date: subscriptionEndDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Profile update error:', profileError)
        throw new Error('Failed to update user profile')
      }

      console.log('✅ Profile updated successfully')

      // Record payment in subscription_history
      const { error: historyError } = await supabase
        .from('subscription_history')
        .insert({
          user_id: userId,
          plan_id: planId,
          amount: transaction.amount / 100, // Convert from kobo to main currency
          currency: transaction.currency,
          billing_cycle: billingCycle,
          payment_method: 'paystack',
          payment_reference: reference,
          paystack_transaction_id: transaction.id,
          paystack_customer_code: transaction.customer?.customer_code,
          payment_channel: transaction.channel,
          status: 'completed',
          starts_at: new Date().toISOString(),
          ends_at: subscriptionEndDate.toISOString(),
          metadata: {
            customer: transaction.customer,
            authorization: transaction.authorization,
            ip_address: transaction.ip_address,
            fees: transaction.fees,
            paid_at: transaction.paid_at
          }
        })

      if (historyError) {
        console.error('History insert error:', historyError)
        // Don't fail the request - profile is already updated
        console.warn('⚠️ Payment recorded in profile but not in history')
      } else {
        console.log('✅ Payment recorded in subscription_history')
      }

      // Store payment method if authorization is reusable
      if (transaction.authorization?.reusable) {
        const { error: methodError } = await supabase
          .from('payment_methods')
          .insert({
            user_id: userId,
            type: 'card',
            provider: 'paystack',
            provider_payment_id: transaction.authorization.authorization_code,
            paystack_authorization_code: transaction.authorization.authorization_code,
            last_four: transaction.authorization.last4,
            brand: transaction.authorization.brand,
            paystack_card_type: transaction.authorization.card_type,
            paystack_bank: transaction.authorization.bank,
            exp_month: transaction.authorization.exp_month,
            exp_year: transaction.authorization.exp_year,
            paystack_country_code: transaction.authorization.country_code,
            is_default: true
          })

        if (methodError) {
          console.error('Payment method save error:', methodError)
          // Don't fail - payment is already processed
        } else {
          console.log('✅ Payment method saved for future use')
        }
      }

      // Send success email (optional)
      try {
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        if (resendApiKey) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'SurveyGuy <infoajumapro@gmail.com>',
              to: [transaction.customer.email],
              subject: `Payment Confirmed - ${planId} Plan`,
              html: `
                <h2>Payment Successful! 🎉</h2>
                <p>Thank you for upgrading to the ${planId} plan.</p>
                <p><strong>Amount Paid:</strong> ${transaction.currency} ${(transaction.amount / 100).toFixed(2)}</p>
                <p><strong>Reference:</strong> ${reference}</p>
                <p><strong>Plan:</strong> ${planId.toUpperCase()}</p>
                <p><strong>Billing:</strong> ${billingCycle}</p>
                <p><strong>Valid Until:</strong> ${subscriptionEndDate.toLocaleDateString()}</p>
                <p>Your account has been upgraded and all features are now available.</p>
                <p>Thank you for choosing SurveyGuy!</p>
                <hr>
                <p style="font-size: 12px; color: #666;">
                  Questions? Contact us at infoajumapro@gmail.com<br>
                  Phone: +233 24 973 9599
                </p>
              `
            })
          })
          console.log('✅ Confirmation email sent')
        }
      } catch (emailError) {
        console.error('Email send error:', emailError)
        // Don't fail the payment if email fails
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment verified and plan upgraded successfully',
          transaction: {
            reference: transaction.reference,
            amount: transaction.amount / 100,
            currency: transaction.currency,
            status: transaction.status,
            paid_at: transaction.paid_at,
            channel: transaction.channel
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else {
      // Payment failed or pending
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment not successful',
          status: verificationData.data?.status || 'unknown'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('❌ Payment verification error:', error)
    return new Response(
      JSON.stringify({
        error: 'Payment verification failed',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

