import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';
import { logSecurityEvent } from '../../lib/security';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    logSecurityEvent('WEBHOOK_VERIFICATION_FAILED', { error: err }, req);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    logSecurityEvent('WEBHOOK_PROCESSING_ERROR', { error, eventType: event.type }, req);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session completed:', session.id);

  const invoiceNumber = session.metadata?.invoiceNumber;
  const userId = session.metadata?.userId;
  const customerEmail = session.customer_details?.email;
  const paymentType = session.metadata?.type;

  try {
    // Handle different payment types
    if (paymentType === 'per_invoice') {
      // For per-invoice payments, just log the activity
      if (userId) {
        await supabase
          .from('user_activity')
          .insert({
            user_id: userId,
            activity_type: 'per_invoice_payment',
            description: `Per-invoice payment completed - ${invoiceNumber}`,
            metadata: {
              session_id: session.id,
              amount: session.amount_total,
              currency: session.currency,
              invoice_number: invoiceNumber
            }
          });
      }
    } else {
      // For premium/subscription payments, update premium status
      if (userId) {
        await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
          })
          .eq('id', userId);

        // Log payment success
        await supabase
          .from('user_activity')
          .insert({
            user_id: userId,
            activity_type: 'payment_success',
            description: `Premium invoice generation purchased - ${invoiceNumber}`,
            metadata: {
              session_id: session.id,
              amount: session.amount_total,
              currency: session.currency
            }
          });
      }
    }

    // Send payment confirmation email
    if (customerEmail) {
      const isPerInvoice = paymentType === 'per_invoice';
      const subject = isPerInvoice ? 'Invoice Payment Confirmed - StitchesX' : 'Payment Confirmation - StitchesX';
      const htmlContent = isPerInvoice ? `
        <h1>Invoice Payment Confirmed!</h1>
        <p>Thank you for your payment. Your invoice has been processed successfully.</p>
        <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
        <p><strong>Amount:</strong> £${(session.amount_total! / 100).toFixed(2)}</p>
        <p>You can now download your invoice. Need more invoices? Consider upgrading to Premium for unlimited access!</p>
      ` : `
        <h1>Payment Confirmed!</h1>
        <p>Thank you for your purchase. Your premium invoice generation is now active.</p>
        <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
        <p><strong>Amount:</strong> £${(session.amount_total! / 100).toFixed(2)}</p>
        <p>You can now generate unlimited premium invoices!</p>
      `;

      await supabase.rpc('send_email', {
        p_to_email: customerEmail,
        p_subject: subject,
        p_html_content: htmlContent,
        p_to_name: session.customer_details?.name || 'Customer',
        p_template_id: isPerInvoice ? 'per_invoice_confirmation' : 'payment_confirmation',
        p_template_variables: {
          invoice_number: invoiceNumber,
          amount: session.amount_total! / 100,
          payment_type: paymentType
        }
      });
    }

    logSecurityEvent('PAYMENT_SUCCESS', { 
      sessionId: session.id, 
      invoiceNumber, 
      userId,
      amount: session.amount_total 
    }, { headers: {} } as any);

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing subscription created:', subscription.id);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;

  try {
    // Get customer details
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    
    // Find user by email
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', customer.email)
      .single();

    if (profile) {
      // Update user subscription status
      await supabase
        .from('profiles')
        .update({
          is_premium: true,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_price_id: priceId,
          premium_expires_at: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('id', profile.id);

      // Log subscription creation
      await supabase
        .from('user_activity')
        .insert({
          user_id: profile.id,
          activity_type: 'subscription_created',
          description: `Subscription created - ${subscription.status}`,
          metadata: {
            subscription_id: subscription.id,
            price_id: priceId,
            current_period_end: subscription.current_period_end
          }
        });
    }

  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription updated:', subscription.id);

  try {
    // Update subscription status
    await supabase
      .from('profiles')
      .update({
        subscription_status: subscription.status,
        premium_expires_at: new Date(subscription.current_period_end * 1000).toISOString()
      })
      .eq('subscription_id', subscription.id);

  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deleted:', subscription.id);

  try {
    // Update user status to free
    await supabase
      .from('profiles')
      .update({
        is_premium: false,
        subscription_id: null,
        subscription_status: 'canceled',
        premium_expires_at: null
      })
      .eq('subscription_id', subscription.id);

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment succeeded:', invoice.id);

  try {
    // Update subscription status
    if (invoice.subscription) {
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          premium_expires_at: new Date(invoice.period_end * 1000).toISOString()
        })
        .eq('subscription_id', invoice.subscription as string);
    }

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment failed:', invoice.id);

  try {
    // Update subscription status
    if (invoice.subscription) {
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'past_due'
        })
        .eq('subscription_id', invoice.subscription as string);
    }

  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
    throw error;
  }
}

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
