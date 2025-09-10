import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { sanitizeInput, checkRateLimit, validateRequiredFields, logSecurityEvent } from '../../lib/security';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  if (!checkRateLimit(req, res, 10, 15 * 60 * 1000)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sanitize and validate input
    const sanitizedBody = sanitizeInput(req.body);
    const { invoiceNumber, userId, customerEmail } = sanitizedBody;

    // Validate required fields
    const validation = validateRequiredFields(sanitizedBody, ['invoiceNumber']);
    if (!validation.isValid) {
      logSecurityEvent('INVALID_INPUT', { missingFields: validation.missingFields }, req);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields: validation.missingFields 
      });
    }

    // Use per-invoice price ID (£2 per invoice)
    const priceId = process.env.STRIPE_PER_INVOICE_PRICE_ID;
    
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
      success_url: `${req.headers.origin || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/cancel`,
      metadata: {
        invoiceNumber,
        userId: userId || 'anonymous',
        type: 'per_invoice',
        amount: '2.00',
        currency: 'GBP'
      },
      customer_email: customerEmail,
    });

    logSecurityEvent('PER_INVOICE_PAYMENT_CREATED', { 
      sessionId: session.id, 
      invoiceNumber, 
      userId 
    }, req);

    res.json({ sessionId: session.id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('PER_INVOICE_PAYMENT_ERROR', { error: errorMessage }, req);
    console.error('Error creating per-invoice payment session:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
}
