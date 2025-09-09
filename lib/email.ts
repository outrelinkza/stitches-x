// Email utility functions for StitchesX
import { supabase } from './supabase';

export interface EmailOptions {
  to_email: string;
  to_name?: string;
  user_id?: string;
}

export interface InvoiceEmailOptions extends EmailOptions {
  invoice_data: any;
}

export interface PaymentEmailOptions extends EmailOptions {
  invoice_data: any;
  payment_data: any;
}

// Send welcome email to new users
export async function sendWelcomeEmail(options: EmailOptions): Promise<{ success: boolean; email_id?: string; error?: string }> {
  try {
    if (!options.to_name || !options.user_id) {
      return { success: false, error: 'Missing required fields for welcome email' };
    }

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'welcome',
        to_email: options.to_email,
        to_name: options.to_name,
        user_id: options.user_id
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to send welcome email' };
    }

    return { success: true, email_id: result.email_id };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: 'Failed to send welcome email' };
  }
}

// Send invoice email to clients
export async function sendInvoiceEmail(options: InvoiceEmailOptions): Promise<{ success: boolean; email_id?: string; error?: string }> {
  try {
    if (!options.invoice_data) {
      return { success: false, error: 'Missing invoice data' };
    }

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'invoice',
        to_email: options.to_email,
        to_name: options.to_name || 'Client',
        invoice_data: options.invoice_data,
        user_id: options.user_id
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to send invoice email' };
    }

    return { success: true, email_id: result.email_id };
  } catch (error) {
    console.error('Invoice email error:', error);
    return { success: false, error: 'Failed to send invoice email' };
  }
}

// Send payment confirmation email
export async function sendPaymentConfirmationEmail(options: PaymentEmailOptions): Promise<{ success: boolean; email_id?: string; error?: string }> {
  try {
    if (!options.invoice_data || !options.payment_data || !options.user_id) {
      return { success: false, error: 'Missing required fields for payment confirmation' };
    }

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'payment_confirmation',
        to_email: options.to_email,
        to_name: options.to_name || 'Client',
        invoice_data: options.invoice_data,
        payment_data: options.payment_data,
        user_id: options.user_id
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to send payment confirmation email' };
    }

    return { success: true, email_id: result.email_id };
  } catch (error) {
    console.error('Payment confirmation email error:', error);
    return { success: false, error: 'Failed to send payment confirmation email' };
  }
}

// Send custom email using Supabase function
export async function sendCustomEmail(
  to_email: string,
  to_name: string,
  subject: string,
  html_content: string,
  text_content?: string,
  user_id?: string,
  priority: number = 0
): Promise<{ success: boolean; email_id?: string; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('send_email', {
      p_to_email: to_email,
      p_subject: subject,
      p_html_content: html_content,
      p_to_name: to_name,
      p_text_content: text_content,
      p_template_id: null,
      p_template_variables: {},
      p_user_id: user_id,
      p_priority: priority,
      p_scheduled_at: new Date().toISOString()
    });

    if (error) {
      console.error('Custom email error:', error);
      return { success: false, error: 'Failed to send custom email' };
    }

    return { success: true, email_id: data };
  } catch (error) {
    console.error('Custom email error:', error);
    return { success: false, error: 'Failed to send custom email' };
  }
}

// Get email queue status
export async function getEmailQueueStatus(user_id?: string): Promise<{ success: boolean; emails?: any[]; error?: string }> {
  try {
    let query = supabase
      .from('email_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Email queue status error:', error);
      return { success: false, error: 'Failed to get email queue status' };
    }

    return { success: true, emails: data };
  } catch (error) {
    console.error('Email queue status error:', error);
    return { success: false, error: 'Failed to get email queue status' };
  }
}

// Get email logs
export async function getEmailLogs(user_id?: string): Promise<{ success: boolean; logs?: any[]; error?: string }> {
  try {
    let query = supabase
      .from('email_logs')
      .select(`
        *,
        email_queue!inner(user_id)
      `)
      .order('sent_at', { ascending: false })
      .limit(100);

    if (user_id) {
      query = query.eq('email_queue.user_id', user_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Email logs error:', error);
      return { success: false, error: 'Failed to get email logs' };
    }

    return { success: true, logs: data };
  } catch (error) {
    console.error('Email logs error:', error);
    return { success: false, error: 'Failed to get email logs' };
  }
}
