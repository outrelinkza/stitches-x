import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get user's payment history from user_activity table
    const { data: payments, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .in('activity_type', ['payment_success', 'subscription_created', 'subscription_updated'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment history:', error);
      return res.status(500).json({ error: 'Failed to fetch payment history' });
    }

    // Get user's subscription status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, subscription_status, premium_expires_at, subscription_id')
      .eq('id', userId)
      .single();

    res.json({
      payments: payments || [],
      subscription: {
        isPremium: profile?.is_premium || false,
        status: profile?.subscription_status || 'inactive',
        expiresAt: profile?.premium_expires_at,
        subscriptionId: profile?.subscription_id
      }
    });

  } catch (error) {
    console.error('Error in payment history API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

