import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { sanitizeInput, checkRateLimit, logSecurityEvent } from '../../lib/security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  if (!checkRateLimit(req, res, 10, 15 * 60 * 1000)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { userId, action, invoiceId, amount } = sanitizedBody;

    // Validate required fields
    if (!userId || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Track user activity
    const { data: trackingData, error: trackingError } = await supabase
      .from('user_activity')
      .insert({
        user_id: userId,
        action: action,
        invoice_id: invoiceId || null,
        amount: amount || null,
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        created_at: new Date().toISOString()
      });

    if (trackingError) {
      logSecurityEvent('TRACKING_ERROR', { error: trackingError.message, userId, action }, req);
      return res.status(500).json({ error: 'Failed to track user activity' });
    }

    // Update user download count if it's a download action
    if (action === 'invoice_download') {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('free_downloads_used')
        .eq('user_id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows found
        logSecurityEvent('USER_UPDATE_ERROR', { error: userError.message, userId }, req);
        return res.status(500).json({ error: 'Failed to update user data' });
      }

      const currentDownloads = userData?.free_downloads_used || 0;
      
      // Update or insert user profile
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          free_downloads_used: currentDownloads + 1,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        logSecurityEvent('USER_UPSERT_ERROR', { error: upsertError.message, userId }, req);
        return res.status(500).json({ error: 'Failed to update user profile' });
      }
    }

    logSecurityEvent('USER_ACTIVITY_TRACKED', { userId, action, invoiceId }, req);
    res.json({ success: true, message: 'Activity tracked successfully' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('TRACKING_API_ERROR', { error: errorMessage }, req);
    console.error('Error in user tracking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
