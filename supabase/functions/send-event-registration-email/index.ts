// Supabase Edge Function for sending event registration confirmation emails
// Deploy: supabase functions deploy send-event-registration-email

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
    const { eventId, registration } = await req.json()

    // Validate required fields
    if (!eventId || !registration) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Format dates
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Send confirmation email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Registration confirmed (email not sent - API key not configured)' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'SurveyGuy Events <infoajumapro@gmail.com>',
          to: [registration.email],
          subject: `Registration Confirmed: ${event.title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 40px 20px; background: #f9fafb; }
                .event-card { background: white; border-radius: 12px; padding: 30px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .detail-row { margin: 15px 0; padding: 15px; background: #f3f4f6; border-left: 4px solid #667eea; border-radius: 4px; }
                .detail-label { font-weight: bold; color: #4b5563; font-size: 14px; }
                .detail-value { color: #1f2937; margin-top: 5px; font-size: 16px; }
                .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                .footer { text-align: center; padding: 30px 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
                .badge { display: inline-block; padding: 6px 12px; background: #10b981; color: white; border-radius: 20px; font-size: 12px; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 You're Registered!</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Your spot is confirmed</p>
                </div>
                
                <div class="content">
                  <div class="event-card">
                    <span class="badge">✓ CONFIRMED</span>
                    <h2 style="color: #1f2937; margin: 20px 0 10px 0;">${event.title}</h2>
                    <p style="color: #6b7280; margin: 0 0 20px 0;">${event.description || 'We\'re excited to have you!'}</p>
                    
                    <div class="detail-row">
                      <div class="detail-label">📅 Date</div>
                      <div class="detail-value">${formatDate(event.start_date || event.date)}</div>
                    </div>
                    
                    <div class="detail-row">
                      <div class="detail-label">🕐 Time</div>
                      <div class="detail-value">${event.time || formatTime(event.start_date || event.date)}</div>
                    </div>
                    
                    <div class="detail-row">
                      <div class="detail-label">📍 Location</div>
                      <div class="detail-value">${event.location || 'To be announced'}</div>
                    </div>
                    
                    ${event.virtual_link ? `
                      <div class="detail-row">
                        <div class="detail-label">🌐 Virtual Event Link</div>
                        <div class="detail-value"><a href="${event.virtual_link}" style="color: #667eea;">${event.virtual_link}</a></div>
                      </div>
                    ` : ''}
                    
                    <div class="detail-row">
                      <div class="detail-label">👤 Registrant</div>
                      <div class="detail-value">${registration.name}</div>
                    </div>
                    
                    ${registration.attendees && registration.attendees > 1 ? `
                      <div class="detail-row">
                        <div class="detail-label">👥 Number of Attendees</div>
                        <div class="detail-value">${registration.attendees} people</div>
                      </div>
                    ` : ''}
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${supabaseUrl.replace('.supabase.co', '')}/app/events/${eventId}" class="button">View Event Details</a>
                  </div>
                  
                  <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400e;"><strong>📱 Add to Calendar</strong></p>
                    <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">
                      Don't forget to add this event to your calendar! We'll send you a reminder 24 hours before the event.
                    </p>
                  </div>
                  
                  <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px;">
                    <p style="margin: 0; color: #1e40af;"><strong>ℹ️ What to Expect</strong></p>
                    <ul style="margin: 10px 0 0 0; color: #1e40af; font-size: 14px;">
                      <li>Arrive 15 minutes early for check-in</li>
                      <li>Bring a valid ID for verification</li>
                      <li>Check your email for any updates</li>
                      <li>Contact us if you need to make changes</li>
                    </ul>
                  </div>
                </div>
                
                <div class="footer">
                  <p><strong>Need to make changes?</strong></p>
                  <p>Contact us at <a href="mailto:infoajumapro@gmail.com" style="color: #667eea;">infoajumapro@gmail.com</a></p>
                  <p style="margin-top: 20px;">
                    <a href="tel:+233249739599" style="color: #667eea; text-decoration: none;">📞 +233 24 973 9599</a> • 
                    <a href="tel:+233506985503" style="color: #667eea; text-decoration: none;">📞 +233 50 698 5503</a>
                  </p>
                  <p style="margin-top: 20px; font-size: 12px;">
                    © 2024 SurveyGuy. All rights reserved.<br>
                    Accra, Ghana
                  </p>
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
        throw new Error('Failed to send email')
      }

      console.log('Event registration email sent successfully')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Registration confirmation email sent successfully' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send confirmation email',
          details: emailError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error processing event registration email:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

