import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { sanitizeInput, checkRateLimit, logSecurityEvent } from '../../lib/security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  if (!checkRateLimit(req, res, 20, 15 * 60 * 1000)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { userId } = sanitizedBody;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('free_downloads_used, is_premium, created_at, updated_at')
      .eq('user_id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows found
      logSecurityEvent('PROFILE_FETCH_ERROR', { error: profileError.message, userId }, req);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    // If no profile exists, create one with default values
    if (!profileData) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          free_downloads_used: 0,
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        logSecurityEvent('PROFILE_CREATE_ERROR', { error: createError.message, userId }, req);
        return res.status(500).json({ error: 'Failed to create user profile' });
      }

      logSecurityEvent('PROFILE_CREATED', { userId }, req);
      return res.json({
        freeDownloadsUsed: newProfile.free_downloads_used,
        isPremium: newProfile.is_premium,
        createdAt: newProfile.created_at
      });
    }

    logSecurityEvent('PROFILE_FETCHED', { userId }, req);
    res.json({
      freeDownloadsUsed: profileData.free_downloads_used,
      isPremium: profileData.is_premium,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('PROFILE_API_ERROR', { error: errorMessage }, req);
    console.error('Error in user profile API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
