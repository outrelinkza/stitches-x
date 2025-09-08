import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'USD' } = req.body;

    // Mock payment session (since we don't have real Stripe keys)
    const mockSession = {
      id: `cs_mock_${Date.now()}`,
      url: '/success?session_id=mock_session',
      amount_total: amount,
      currency: currency,
      payment_status: 'paid',
      customer_email: 'test@example.com'
    };

    // Simulate a successful payment for demo purposes
    res.status(200).json({
      sessionId: mockSession.id,
      url: mockSession.url,
      message: 'Mock payment successful - redirecting to success page'
    });

  } catch (error) {
    console.error('Error creating mock payment:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
}
