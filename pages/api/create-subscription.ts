import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { sanitizeInput, checkRateLimit, validateRequiredFields, logSecurityEvent } from '../../lib/security';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  if (!checkRateLimit(req, res, 3, 15 * 60 * 1000)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sanitize and validate input
    const sanitizedBody = sanitizeInput(req.body);
    const { plan, customerEmail, userId } = sanitizedBody;

    // Validate required fields
    const validation = validateRequiredFields(sanitizedBody, ['plan']);
    if (!validation.isValid) {
      logSecurityEvent('INVALID_INPUT', { missingFields: validation.missingFields }, req);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields: validation.missingFields 
      });
    }

    // Get the appropriate price ID based on plan
    let priceId: string;
    switch (plan) {
      case 'monthly':
        priceId = process.env.STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID!;
        break;
      case 'annual':
        priceId = process.env.STRIPE_ANNUAL_SUBSCRIPTION_PRICE_ID!;
        break;
      case 'enterprise':
        priceId = process.env.STRIPE_ENTERPRISE_PRICE_ID!;
        break;
      default:
        logSecurityEvent('INVALID_SUBSCRIPTION_PLAN', { plan }, req);
        return res.status(400).json({ error: 'Invalid subscription plan' });
    }

    if (!priceId) {
      logSecurityEvent('MISSING_STRIPE_PRICE_ID', { plan }, req);
      return res.status(500).json({ error: 'Subscription configuration error' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: {
        userId: userId || 'anonymous',
        plan: plan,
        type: 'subscription'
      },
      customer_email: customerEmail,
      subscription_data: {
        metadata: {
          userId: userId || 'anonymous',
          plan: plan
        }
      }
    });

    logSecurityEvent('SUBSCRIPTION_SESSION_CREATED', { 
      sessionId: session.id, 
      plan, 
      userId 
    }, req);

    res.json({ sessionId: session.id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('SUBSCRIPTION_SESSION_ERROR', { error: errorMessage }, req);
    console.error('Error creating subscription session:', error);
    res.status(500).json({ error: 'Failed to create subscription session' });
  }
}
