import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { sanitizeInput, isValidAmount, isValidInvoiceNumber, checkRateLimit, validateRequiredFields, logSecurityEvent } from '../../lib/security';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  if (!checkRateLimit(req, res, 5, 15 * 60 * 1000)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sanitize and validate input
    const sanitizedBody = sanitizeInput(req.body);
    const { amount, invoiceNumber } = sanitizedBody;

    // Validate required fields
    const validation = validateRequiredFields(sanitizedBody, ['amount', 'invoiceNumber']);
    if (!validation.isValid) {
      logSecurityEvent('INVALID_INPUT', { missingFields: validation.missingFields }, req);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields: validation.missingFields 
      });
    }

    // Validate amount
    if (!isValidAmount(amount)) {
      logSecurityEvent('INVALID_AMOUNT', { amount }, req);
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Validate invoice number
    if (!isValidInvoiceNumber(invoiceNumber)) {
      logSecurityEvent('INVALID_INVOICE_NUMBER', { invoiceNumber }, req);
      return res.status(400).json({ error: 'Invalid invoice number format' });
    }

    // Use pre-configured Stripe price ID
    const priceId = process.env.STRIPE_PREMIUM_INVOICE_PRICE_ID;
    
    if (!priceId) {
      logSecurityEvent('MISSING_STRIPE_PRICE_ID', {}, req);
      return res.status(500).json({ error: 'Payment configuration error' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: {
        invoiceNumber,
        userId: req.body.userId || 'anonymous',
        type: 'premium_invoice'
      },
      customer_email: req.body.customerEmail,
    });

    logSecurityEvent('PAYMENT_SESSION_CREATED', { sessionId: session.id, amount, invoiceNumber }, req);
    res.json({ sessionId: session.id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('PAYMENT_SESSION_ERROR', { error: errorMessage }, req);
    console.error('Error creating payment session:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
}
