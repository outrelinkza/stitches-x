-- Complete Setup for StitchesX - Security Fixes + Email System
-- Run this in your Supabase SQL Editor

-- ========================================
-- PART 1: SECURITY FIXES
-- ========================================

-- 1. Drop all problematic views completely
DROP VIEW IF EXISTS public.gdpr_compliance_dashboard CASCADE;
DROP VIEW IF EXISTS public.security_dashboard CASCADE;

-- 2. Recreate views without SECURITY DEFINER and without exposing auth.users
CREATE VIEW public.gdpr_compliance_dashboard AS
SELECT 
  'Pending GDPR Requests' as metric,
  COUNT(*) as count
FROM public.gdpr_requests 
WHERE status = 'pending'
UNION ALL
SELECT 
  'Data Export Requests (30 days)' as metric,
  COUNT(*) as count
FROM public.gdpr_requests 
WHERE request_type = 'data_export' 
  AND created_at > NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'Data Deletion Requests (30 days)' as metric,
  COUNT(*) as count
FROM public.gdpr_requests 
WHERE request_type = 'data_deletion' 
  AND created_at > NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'Total GDPR Requests' as metric,
  COUNT(*) as count
FROM public.gdpr_requests;

-- 3. Recreate security dashboard without SECURITY DEFINER and without exposing auth.users
CREATE VIEW public.security_dashboard AS
SELECT 
  'Failed Login Attempts (24h)' as metric,
  COUNT(*) as count
FROM public.failed_login_attempts 
WHERE last_attempt > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
  'Blocked IPs' as metric,
  COUNT(*) as count
FROM public.failed_login_attempts 
WHERE is_blocked = TRUE AND blocked_until > NOW()
UNION ALL
SELECT 
  'Suspicious Activities (24h)' as metric,
  COUNT(*) as count
FROM public.suspicious_activity 
WHERE created_at > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
  'High Risk Activities (24h)' as metric,
  COUNT(*) as count
FROM public.suspicious_activity 
WHERE risk_score > 75 AND created_at > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
  'Security Events (24h)' as metric,
  COUNT(*) as count
FROM public.security_events 
WHERE created_at > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
  'Total Security Events' as metric,
  COUNT(*) as count
FROM public.security_events;

-- 4. Create a simple user count view that doesn't expose auth.users directly
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  'Total Profiles' as metric,
  COUNT(*) as count
FROM public.profiles
UNION ALL
SELECT 
  'Active Users (30 days)' as metric,
  COUNT(*) as count
FROM public.profiles
WHERE updated_at > NOW() - INTERVAL '30 days';

-- ========================================
-- PART 2: EMAIL SYSTEM SETUP
-- ========================================

-- 1. Create email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create email queue table
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  to_name TEXT,
  from_email TEXT NOT NULL DEFAULT 'noreply@stixches.vercel.app',
  from_name TEXT NOT NULL DEFAULT 'StitchesX',
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_id UUID REFERENCES public.email_templates(id),
  template_variables JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create email logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_queue_id UUID REFERENCES public.email_queue(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  provider_response JSONB,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on all tables
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
-- Email templates - only authenticated users can read
CREATE POLICY "Authenticated users can read email templates" ON public.email_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Email queue - users can only see their own emails
CREATE POLICY "Users can view own emails" ON public.email_queue
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can insert emails" ON public.email_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Email logs - users can only see their own email logs
CREATE POLICY "Users can view own email logs" ON public.email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.email_queue eq 
      WHERE eq.id = email_logs.email_queue_id 
        AND (eq.user_id = auth.uid() OR eq.user_id IS NULL)
    )
  );

-- ========================================
-- PART 3: EMAIL FUNCTIONS
-- ========================================

-- 1. Create function to send email
CREATE OR REPLACE FUNCTION public.send_email(
  p_to_email TEXT,
  p_subject TEXT,
  p_html_content TEXT,
  p_to_name TEXT DEFAULT NULL,
  p_text_content TEXT DEFAULT NULL,
  p_template_id UUID DEFAULT NULL,
  p_template_variables JSONB DEFAULT '{}',
  p_user_id UUID DEFAULT NULL,
  p_priority INTEGER DEFAULT 0,
  p_scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
  email_id UUID;
BEGIN
  -- Insert email into queue
  INSERT INTO public.email_queue (
    to_email, to_name, subject, html_content, text_content,
    template_id, template_variables, user_id, priority, scheduled_at
  ) VALUES (
    p_to_email, p_to_name, p_subject, p_html_content, p_text_content,
    p_template_id, p_template_variables, p_user_id, p_priority, p_scheduled_at
  ) RETURNING id INTO email_id;
  
  -- Log the email creation
  INSERT INTO public.email_logs (email_queue_id, to_email, subject, status)
  VALUES (email_id, p_to_email, p_subject, 'queued');
  
  RETURN email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Create function to send welcome email
CREATE OR REPLACE FUNCTION public.send_welcome_email(
  p_to_email TEXT,
  p_to_name TEXT,
  p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  email_id UUID;
  subject_text TEXT := 'Welcome to StitchesX - Your Professional Invoice Generator';
  html_content TEXT;
  text_content TEXT;
BEGIN
  html_content := '
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to StitchesX</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
        .content { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to StitchesX!</h1>
        <p>Your Professional Invoice Generator</p>
      </div>
      
      <div class="content">
        <h2>Hi ' || p_to_name || ',</h2>
        
        <p>Welcome to StitchesX! We''re excited to help you create professional invoices with ease.</p>
        
        <h3>What you can do with StitchesX:</h3>
        <ul>
          <li>Create professional invoices in minutes</li>
          <li>Customize templates to match your brand</li>
          <li>Generate PDF invoices instantly</li>
          <li>Track your invoice history</li>
          <li>Manage your clients efficiently</li>
        </ul>
        
        <p>Get started by creating your first invoice:</p>
        <a href="https://stixches.vercel.app" class="button">Create Your First Invoice</a>
        
        <h3>Need Help?</h3>
        <p>Check out our <a href="https://stixches.vercel.app/onboarding">getting started guide</a> or contact our support team.</p>
        
        <p>Happy invoicing!</p>
        <p>The StitchesX Team</p>
      </div>
      
      <div class="footer">
        <p>StitchesX - Professional Invoice Generator</p>
        <p>If you didn''t create an account, please ignore this email.</p>
      </div>
    </body>
    </html>';
  
  text_content := 'Welcome to StitchesX!

Hi ' || p_to_name || ',

Welcome to StitchesX! We''re excited to help you create professional invoices with ease.

What you can do with StitchesX:
- Create professional invoices in minutes
- Customize templates to match your brand
- Generate PDF invoices instantly
- Track your invoice history
- Manage your clients efficiently

Get started by creating your first invoice:
https://stixches.vercel.app

Need Help?
Check out our getting started guide: https://stixches.vercel.app/onboarding

Happy invoicing!
The StitchesX Team

StitchesX - Professional Invoice Generator
If you didn''t create an account, please ignore this email.';
  
  -- Send the email
  SELECT public.send_email(
    p_to_email,
    subject_text,
    html_content,
    p_to_name,
    text_content,
    NULL, -- template_id
    jsonb_build_object('name', p_to_name), -- template_variables
    p_user_id,
    0, -- priority
    NOW() -- scheduled_at
  ) INTO email_id;
  
  RETURN email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Create function to send invoice email
CREATE OR REPLACE FUNCTION public.send_invoice_email(
  p_to_email TEXT,
  p_to_name TEXT,
  p_invoice_data JSONB,
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  email_id UUID;
  subject_text TEXT;
  html_content TEXT;
  text_content TEXT;
BEGIN
  -- Generate subject
  subject_text := 'Invoice ' || (p_invoice_data->>'invoice_number') || ' from ' || (p_invoice_data->>'company_name');
  
  -- Generate HTML content
  html_content := '
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ' || (p_invoice_data->>'invoice_number') || '</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .invoice-details { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .total { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Invoice ' || (p_invoice_data->>'invoice_number') || '</h1>
        <p>From: ' || (p_invoice_data->>'company_name') || '</p>
        <p>Date: ' || (p_invoice_data->>'invoice_date') || '</p>
        <p>Due Date: ' || (p_invoice_data->>'due_date') || '</p>
      </div>
      
      <div class="invoice-details">
        <h3>Bill To:</h3>
        <p>' || (p_invoice_data->>'client_name') || '<br>
        ' || (p_invoice_data->>'client_address') || '</p>
        
        <h3>Items:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f8f9fa;">
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
          </tr>';
  
  -- Add line items
  FOR i IN 0..jsonb_array_length(p_invoice_data->'line_items') - 1 LOOP
    html_content := html_content || '
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">' || (p_invoice_data->'line_items'->i->>'description') || '</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">' || (p_invoice_data->'line_items'->i->>'quantity') || '</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$' || (p_invoice_data->'line_items'->i->>'price') || '</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$' || (p_invoice_data->'line_items'->i->>'total') || '</td>
      </tr>';
  END LOOP;
  
  html_content := html_content || '
        </table>
        
        <div class="total">
          <p><strong>Subtotal: $' || (p_invoice_data->>'subtotal') || '</strong></p>
          <p>Tax: $' || (p_invoice_data->>'tax_amount') || '</p>
          <p><strong>Total: $' || (p_invoice_data->>'total') || '</strong></p>
        </div>
        
        <p>' || (p_invoice_data->>'notes') || '</p>
      </div>
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>This invoice was generated by StitchesX - Professional Invoice Generator</p>
      </div>
    </body>
    </html>';
  
  -- Generate text content
  text_content := 'Invoice ' || (p_invoice_data->>'invoice_number') || '
From: ' || (p_invoice_data->>'company_name') || '
Date: ' || (p_invoice_data->>'invoice_date') || '
Due Date: ' || (p_invoice_data->>'due_date') || '

Bill To:
' || (p_invoice_data->>'client_name') || '
' || (p_invoice_data->>'client_address') || '

Items:';
  
  -- Add line items to text
  FOR i IN 0..jsonb_array_length(p_invoice_data->'line_items') - 1 LOOP
    text_content := text_content || '
- ' || (p_invoice_data->'line_items'->i->>'description') || ' (Qty: ' || (p_invoice_data->'line_items'->i->>'quantity') || ', Price: $' || (p_invoice_data->'line_items'->i->>'price') || ', Total: $' || (p_invoice_data->'line_items'->i->>'total') || ')';
  END LOOP;
  
  text_content := text_content || '

Subtotal: $' || (p_invoice_data->>'subtotal') || '
Tax: $' || (p_invoice_data->>'tax_amount') || '
Total: $' || (p_invoice_data->>'total') || '

' || (p_invoice_data->>'notes') || '

Thank you for your business!
This invoice was generated by StitchesX - Professional Invoice Generator';
  
  -- Send the email
  SELECT public.send_email(
    p_to_email,
    subject_text,
    html_content,
    p_to_name,
    text_content,
    NULL, -- template_id
    p_invoice_data, -- template_variables
    p_user_id,
    1, -- priority
    NOW() -- scheduled_at
  ) INTO email_id;
  
  RETURN email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Create function to send payment confirmation email
CREATE OR REPLACE FUNCTION public.send_payment_confirmation_email(
  p_to_email TEXT,
  p_to_name TEXT,
  p_invoice_data JSONB,
  p_payment_data JSONB,
  p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  email_id UUID;
  subject_text TEXT := 'Payment Confirmation - Invoice ' || (p_invoice_data->>'invoice_number');
  html_content TEXT;
  text_content TEXT;
BEGIN
  html_content := '
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .content { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Payment Confirmation</h1>
        <p>Invoice ' || (p_invoice_data->>'invoice_number') || '</p>
      </div>
      
      <div class="content">
        <div class="success">
          <h3>Payment Successful!</h3>
          <p>Your payment has been processed successfully.</p>
        </div>
        
        <h3>Payment Details:</h3>
        <p><strong>Amount:</strong> $' || (p_payment_data->>'amount') || '</p>
        <p><strong>Payment Method:</strong> ' || (p_payment_data->>'payment_method') || '</p>
        <p><strong>Transaction ID:</strong> ' || (p_payment_data->>'transaction_id') || '</p>
        <p><strong>Date:</strong> ' || (p_payment_data->>'date') || '</p>
        
        <h3>Invoice Details:</h3>
        <p><strong>Invoice Number:</strong> ' || (p_invoice_data->>'invoice_number') || '</p>
        <p><strong>From:</strong> ' || (p_invoice_data->>'company_name') || '</p>
        <p><strong>Total:</strong> $' || (p_invoice_data->>'total') || '</p>
        
        <p>Thank you for your payment! Your invoice has been marked as paid.</p>
        
        <p>If you have any questions, please contact us.</p>
        
        <p>Best regards,<br>The StitchesX Team</p>
      </div>
      
      <div class="footer">
        <p>StitchesX - Professional Invoice Generator</p>
      </div>
    </body>
    </html>';
  
  text_content := 'Payment Confirmation

Payment Successful!
Your payment has been processed successfully.

Payment Details:
Amount: $' || (p_payment_data->>'amount') || '
Payment Method: ' || (p_payment_data->>'payment_method') || '
Transaction ID: ' || (p_payment_data->>'transaction_id') || '
Date: ' || (p_payment_data->>'date') || '

Invoice Details:
Invoice Number: ' || (p_invoice_data->>'invoice_number') || '
From: ' || (p_invoice_data->>'company_name') || '
Total: $' || (p_invoice_data->>'total') || '

Thank you for your payment! Your invoice has been marked as paid.

If you have any questions, please contact us.

Best regards,
The StitchesX Team

StitchesX - Professional Invoice Generator';
  
  -- Send the email
  SELECT public.send_email(
    p_to_email,
    subject_text,
    html_content,
    p_to_name,
    text_content,
    NULL, -- template_id
    jsonb_build_object('invoice', p_invoice_data, 'payment', p_payment_data), -- template_variables
    p_user_id,
    1, -- priority
    NOW() -- scheduled_at
  ) INTO email_id;
  
  RETURN email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ========================================
-- PART 4: WELCOME EMAIL TRIGGER
-- ========================================

-- Create function to send welcome email when user is created
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Send welcome email to new user
  PERFORM public.send_welcome_email(
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to send welcome email when user signs up
DROP TRIGGER IF EXISTS send_welcome_email_trigger ON auth.users;
CREATE TRIGGER send_welcome_email_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email_on_signup();

-- ========================================
-- PART 5: GRANTS AND PERMISSIONS
-- ========================================

-- Grant permissions to views
GRANT SELECT ON public.gdpr_compliance_dashboard TO authenticated;
GRANT SELECT ON public.security_dashboard TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;

-- Grant permissions to email tables
GRANT SELECT, INSERT, UPDATE ON public.email_queue TO authenticated;
GRANT SELECT ON public.email_templates TO authenticated;
GRANT SELECT ON public.email_logs TO authenticated;

-- Grant permissions to email functions
GRANT EXECUTE ON FUNCTION public.send_email(TEXT, TEXT, TEXT, TEXT, TEXT, UUID, JSONB, UUID, INTEGER, TIMESTAMP WITH TIME ZONE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_invoice_email(TEXT, TEXT, JSONB, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_welcome_email(TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_payment_confirmation_email(TEXT, TEXT, JSONB, JSONB, UUID) TO authenticated;

-- ========================================
-- PART 6: INDEXES FOR PERFORMANCE
-- ========================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled_at ON public.email_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_user_id ON public.email_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_queue_id ON public.email_logs(email_queue_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at);

-- ========================================
-- PART 7: DEFAULT EMAIL TEMPLATES
-- ========================================

-- Insert default email templates
INSERT INTO public.email_templates (template_name, subject, html_content, text_content, variables) VALUES
('welcome', 'Welcome to StitchesX!', '<h1>Welcome {{name}}!</h1><p>Thank you for joining StitchesX.</p>', 'Welcome {{name}}!\n\nThank you for joining StitchesX.', '{"name": "string"}'),
('invoice', 'Invoice {{invoice_number}} from {{company_name}}', '<h1>Invoice {{invoice_number}}</h1><p>From: {{company_name}}</p>', 'Invoice {{invoice_number}}\n\nFrom: {{company_name}}', '{"invoice_number": "string", "company_name": "string"}'),
('payment_confirmation', 'Payment Confirmation - Invoice {{invoice_number}}', '<h1>Payment Confirmation</h1><p>Your payment for invoice {{invoice_number}} has been processed.</p>', 'Payment Confirmation\n\nYour payment for invoice {{invoice_number}} has been processed.', '{"invoice_number": "string"}')
ON CONFLICT (template_name) DO NOTHING;
