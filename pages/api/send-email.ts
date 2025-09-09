import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      type, 
      to_email, 
      to_name, 
      invoice_data, 
      payment_data, 
      user_id 
    } = req.body;

    if (!type || !to_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let emailId: string;

    switch (type) {
      case 'welcome':
        if (!to_name || !user_id) {
          return res.status(400).json({ error: 'Missing required fields for welcome email' });
        }
        
        const { data: welcomeResult, error: welcomeError } = await supabase.rpc('send_welcome_email', {
          p_to_email: to_email,
          p_to_name: to_name,
          p_user_id: user_id
        });

        if (welcomeError) {
          console.error('Welcome email error:', welcomeError);
          return res.status(500).json({ error: 'Failed to send welcome email' });
        }

        emailId = welcomeResult;
        break;

      case 'invoice':
        if (!invoice_data) {
          return res.status(400).json({ error: 'Missing invoice data' });
        }

        const { data: invoiceResult, error: invoiceError } = await supabase.rpc('send_invoice_email', {
          p_to_email: to_email,
          p_to_name: to_name || 'Client',
          p_invoice_data: invoice_data,
          p_user_id: user_id
        });

        if (invoiceError) {
          console.error('Invoice email error:', invoiceError);
          return res.status(500).json({ error: 'Failed to send invoice email' });
        }

        emailId = invoiceResult;
        break;

      case 'payment_confirmation':
        if (!invoice_data || !payment_data || !user_id) {
          return res.status(400).json({ error: 'Missing required fields for payment confirmation' });
        }

        const { data: paymentResult, error: paymentError } = await supabase.rpc('send_payment_confirmation_email', {
          p_to_email: to_email,
          p_to_name: to_name || 'Client',
          p_invoice_data: invoice_data,
          p_payment_data: payment_data,
          p_user_id: user_id
        });

        if (paymentError) {
          console.error('Payment confirmation email error:', paymentError);
          return res.status(500).json({ error: 'Failed to send payment confirmation email' });
        }

        emailId = paymentResult;
        break;

      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    res.status(200).json({ 
      success: true, 
      email_id: emailId,
      message: 'Email queued successfully' 
    });

  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
