// Supabase Edge Function for sending survey invitations via email
// Deploy: supabase functions deploy send-survey-invitation

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
    const { surveyId, recipients, customMessage, senderId } = await req.json()

    // Validate required fields
    if (!surveyId || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch survey details
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .eq('user_id', user.id)
      .eq('status', 'published')
      .single()

    if (surveyError || !survey) {
      return new Response(
        JSON.stringify({ error: 'Survey not found or not published' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = []
    const errors = []

    // Process each recipient
    for (const recipient of recipients) {
      try {
        const { email, name } = recipient

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          errors.push({ email, error: 'Invalid email format' })
          continue
        }

        // Create invitation record
        const { data: invitation, error: inviteError } = await supabase
          .from('survey_invitations')
          .insert({
            survey_id: surveyId,
            sent_by: user.id,
            recipient_email: email.trim().toLowerCase(),
            recipient_name: name || '',
            subject: `You're invited: ${survey.title}`,
            custom_message: customMessage || '',
            status: 'pending',
            invitation_url: `${supabaseUrl.replace('.supabase.co', '')}/survey/${surveyId}`,
            metadata: {
              sender_email: user.email,
              sent_from: 'web_app'
            }
          })
          .select()
          .single()

        if (inviteError) {
          errors.push({ email, error: 'Failed to create invitation' })
          continue
        }

        // Generate invitation URL with token
        const invitationUrl = `${supabaseUrl.replace('.supabase.co', '')}/survey/${surveyId}?invite=${invitation.invitation_token}`

        // Update invitation with full URL
        await supabase
          .from('survey_invitations')
          .update({ invitation_url: invitationUrl })
          .eq('id', invitation.id)

        // Send email via Resend
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'SurveyGuy <infoajumapro@gmail.com>',
            to: [email],
            subject: `You're invited: ${survey.title}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
                  .container { max-width: 600px; margin: 0 auto; background: white; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
                  .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
                  .content { padding: 40px 30px; }
                  .survey-card { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #667eea; }
                  .survey-title { font-size: 22px; font-weight: 700; color: #1f2937; margin: 0 0 10px 0; }
                  .survey-description { color: #6b7280; margin: 0; line-height: 1.6; }
                  .message-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0; }
                  .message-label { font-weight: 700; color: #92400e; margin: 0 0 10px 0; }
                  .message-text { color: #92400e; margin: 0; white-space: pre-wrap; }
                  .cta-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 25px 0; }
                  .cta-button:hover { opacity: 0.9; }
                  .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0; }
                  .info-text { color: #1e40af; margin: 0; font-size: 14px; }
                  .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
                  .footer a { color: #667eea; text-decoration: none; }
                  .stats { display: flex; gap: 20px; margin: 25px 0; }
                  .stat { flex: 1; text-align: center; padding: 15px; background: #f3f4f6; border-radius: 8px; }
                  .stat-value { font-size: 24px; font-weight: 700; color: #667eea; }
                  .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>📋 Survey Invitation</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Your input is valuable to us</p>
                  </div>
                  
                  <div class="content">
                    ${name ? `<p style="font-size: 18px; color: #1f2937;">Hi ${name},</p>` : '<p style="font-size: 18px; color: #1f2937;">Hello,</p>'}
                    
                    <p style="color: #4b5563; line-height: 1.8;">
                      You've been invited to participate in an important survey. Your feedback will help us understand and improve. 
                      The survey takes just a few minutes to complete.
                    </p>
                    
                    <div class="survey-card">
                      <h2 class="survey-title">${survey.title}</h2>
                      ${survey.description ? `<p class="survey-description">${survey.description}</p>` : ''}
                      
                      <div class="stats">
                        <div class="stat">
                          <div class="stat-value">${survey.question_count || 0}</div>
                          <div class="stat-label">Questions</div>
                        </div>
                        <div class="stat">
                          <div class="stat-value">~${Math.ceil((survey.question_count || 0) * 0.5)} min</div>
                          <div class="stat-label">Estimated Time</div>
                        </div>
                      </div>
                    </div>
                    
                    ${customMessage ? `
                      <div class="message-box">
                        <p class="message-label">💬 Personal Message:</p>
                        <p class="message-text">${customMessage}</p>
                      </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin: 35px 0;">
                      <a href="${invitationUrl}" class="cta-button">
                        📝 Take the Survey
                      </a>
                    </div>
                    
                    <div class="info-box">
                      <p class="info-text">
                        <strong>🔒 Privacy Notice:</strong> Your responses are confidential and will be used solely for research purposes. 
                        You can complete the survey at your convenience.
                      </p>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.8;">
                      <strong>Having trouble with the button?</strong><br>
                      Copy and paste this link into your browser:<br>
                      <a href="${invitationUrl}" style="color: #667eea; word-break: break-all;">${invitationUrl}</a>
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p><strong>Questions or concerns?</strong></p>
                    <p>Contact us at <a href="mailto:infoajumapro@gmail.com">infoajumapro@gmail.com</a></p>
                    <p style="margin-top: 20px;">
                      <a href="tel:+233249739599">📞 +233 24 973 9599</a> • 
                      <a href="tel:+233506985503">📞 +233 50 698 5503</a>
                    </p>
                    <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                      © 2024 SurveyGuy. All rights reserved.<br>
                      Accra, Ghana
                    </p>
                    <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
                      You received this email because someone invited you to participate in this survey.<br>
                      <a href="${invitationUrl.replace('/survey/', '/unsubscribe/')}" style="color: #9ca3af;">Unsubscribe</a>
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
          
          // Update invitation status to failed
          await supabase
            .from('survey_invitations')
            .update({ status: 'failed', delivery_status: 'failed' })
            .eq('id', invitation.id)
          
          errors.push({ email, error: 'Failed to send email' })
          continue
        }

        const emailResult = await emailResponse.json()
        
        // Update invitation with email ID and status
        await supabase
          .from('survey_invitations')
          .update({
            status: 'sent',
            email_id: emailResult.id,
            delivery_status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', invitation.id)

        results.push({
          email,
          name,
          invitationId: invitation.id,
          emailId: emailResult.id,
          status: 'sent'
        })

      } catch (error) {
        console.error(`Error processing recipient ${recipient.email}:`, error)
        errors.push({ email: recipient.email, error: error.message })
      }
    }

    // Return summary
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully sent ${results.length} of ${recipients.length} invitations`,
        sent: results.length,
        failed: errors.length,
        results,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending survey invitations:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

