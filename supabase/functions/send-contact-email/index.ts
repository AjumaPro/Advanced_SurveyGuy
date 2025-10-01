// Supabase Edge Function for sending contact form emails
// Deploy: supabase functions deploy send-contact-email

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
    // Parse request body
    const { name, email, subject, message, category, priority } = await req.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current user (if authenticated)
    const authHeader = req.headers.get('Authorization')
    let userId = null
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id || null
    }

    // Store in database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        category: category || 'general',
        priority: priority || 'medium',
        user_id: userId,
        status: 'new',
        metadata: {
          user_agent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for'),
          submitted_at: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store submission' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send email via Resend (if API key is configured)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'SurveyGuy Support <infoajumapro@gmail.com>',
            to: ['infoajumapro@gmail.com'],
            reply_to: email,
            subject: `[${category.toUpperCase()}] ${subject}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                  .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
                  .badge-urgent { background: #fee2e2; color: #991b1b; }
                  .badge-high { background: #fed7aa; color: #9a3412; }
                  .badge-medium { background: #fef3c7; color: #92400e; }
                  .badge-low { background: #d1fae5; color: #065f46; }
                  .info-row { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #667eea; border-radius: 4px; }
                  .label { font-weight: bold; color: #4b5563; }
                  .value { color: #1f2937; margin-top: 5px; }
                  .message-box { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e5e7eb; }
                  .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">📬 New Contact Form Submission</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">SurveyGuy Contact Form</p>
                  </div>
                  <div class="content">
                    <span class="badge badge-${priority}">${priority.toUpperCase()} Priority</span>
                    
                    <div class="info-row">
                      <div class="label">👤 From:</div>
                      <div class="value">${name}</div>
                    </div>
                    
                    <div class="info-row">
                      <div class="label">📧 Email:</div>
                      <div class="value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    
                    <div class="info-row">
                      <div class="label">📁 Category:</div>
                      <div class="value">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                    </div>
                    
                    <div class="info-row">
                      <div class="label">📋 Subject:</div>
                      <div class="value">${subject}</div>
                    </div>
                    
                    <div class="message-box">
                      <div class="label">💬 Message:</div>
                      <div class="value" style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
                    </div>
                    
                    <div class="footer">
                      <p>Submission ID: ${submission.id}</p>
                      <p>Received: ${new Date().toLocaleString()}</p>
                      <p><a href="${supabaseUrl}/project/_/editor" style="color: #667eea;">View in Dashboard</a></p>
                    </div>
                  </div>
                </div>
              </body>
              </html>
            `
          })
        })

        if (!emailResponse.ok) {
          const error = await emailResponse.text()
          console.error('Resend API error:', error)
          // Don't fail the request if email fails, submission is already stored
        } else {
          console.log('Email sent successfully via Resend')
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Don't fail the request if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not configured, skipping email send')
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        submissionId: submission.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing contact form:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

