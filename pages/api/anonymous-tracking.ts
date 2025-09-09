import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { sanitizeInput, checkRateLimit, logSecurityEvent } from '../../lib/security';
import crypto from 'crypto';

// Generate a browser fingerprint
function generateFingerprint(req: NextApiRequest): string {
  const userAgent = req.headers['user-agent'] || '';
  const acceptLanguage = req.headers['accept-language'] || '';
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const connection = req.headers['connection'] || '';
  
  const fingerprint = `${userAgent}-${acceptLanguage}-${acceptEncoding}-${connection}`;
  return crypto.createHash('sha256').update(fingerprint).digest('hex').substring(0, 16);
}

// Get client IP address
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const realIP = req.headers['x-real-ip'] as string;
  const remoteAddress = req.connection.remoteAddress;
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddress) {
    return remoteAddress;
  }
  return 'unknown';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  if (!checkRateLimit(req, res, 5, 15 * 60 * 1000)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { action, invoiceId, amount } = sanitizedBody;

    // Validate required fields
    if (!action) {
      return res.status(400).json({ error: 'Missing action' });
    }

    const clientIP = getClientIP(req);
    const fingerprint = generateFingerprint(req);
    const sessionId = `${clientIP}-${fingerprint}`;

    // Check current anonymous usage
    const { data: existingUsage, error: fetchError } = await supabase
      .from('anonymous_usage')
      .select('downloads_used, last_activity')
      .eq('session_id', sessionId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      logSecurityEvent('ANONYMOUS_FETCH_ERROR', { error: fetchError.message, sessionId }, req);
      return res.status(500).json({ error: 'Failed to check anonymous usage' });
    }

    const currentDownloads = existingUsage?.downloads_used || 0;
    const lastActivity = existingUsage?.last_activity;

    // Check if user has exceeded limits
    const ANONYMOUS_LIMIT = 1; // Only 1 free download for anonymous users
    const COOLDOWN_HOURS = 24; // 24-hour cooldown between downloads

    if (action === 'check_limit') {
      const canDownload = currentDownloads < ANONYMOUS_LIMIT;
      const cooldownExpired = !lastActivity || 
        (new Date().getTime() - new Date(lastActivity).getTime()) > (COOLDOWN_HOURS * 60 * 60 * 1000);

      return res.json({
        canDownload: canDownload && cooldownExpired,
        downloadsUsed: currentDownloads,
        limit: ANONYMOUS_LIMIT,
        cooldownExpired,
        lastActivity
      });
    }

    if (action === 'track_download') {
      // Check if user can download
      if (currentDownloads >= ANONYMOUS_LIMIT) {
        return res.status(429).json({ 
          error: 'Anonymous download limit exceeded',
          message: 'Please create an account for more downloads'
        });
      }

      // Track the download
      const { error: upsertError } = await supabase
        .from('anonymous_usage')
        .upsert({
          session_id: sessionId,
          ip_address: clientIP,
          fingerprint: fingerprint,
          downloads_used: currentDownloads + 1,
          last_activity: new Date().toISOString(),
          user_agent: req.headers['user-agent'],
          invoice_id: invoiceId || null,
          amount: amount || null,
          created_at: existingUsage ? undefined : new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        logSecurityEvent('ANONYMOUS_UPSERT_ERROR', { error: upsertError.message, sessionId }, req);
        return res.status(500).json({ error: 'Failed to track anonymous usage' });
      }

      // Log the activity
      const { error: activityError } = await supabase
        .from('user_activity')
        .insert({
          user_id: `anonymous_${sessionId}`,
          action: 'anonymous_invoice_download',
          invoice_id: invoiceId || null,
          amount: amount || null,
          ip_address: clientIP,
          user_agent: req.headers['user-agent'],
          created_at: new Date().toISOString()
        });

      if (activityError) {
        logSecurityEvent('ANONYMOUS_ACTIVITY_ERROR', { error: activityError.message, sessionId }, req);
      }

      logSecurityEvent('ANONYMOUS_DOWNLOAD_TRACKED', { sessionId, downloadsUsed: currentDownloads + 1 }, req);
      return res.json({ 
        success: true, 
        downloadsUsed: currentDownloads + 1,
        limit: ANONYMOUS_LIMIT,
        message: 'Download tracked successfully'
      });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('ANONYMOUS_API_ERROR', { error: errorMessage }, req);
    console.error('Error in anonymous tracking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
