import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { getClientIp, logSecurityEvent, SecurityEventTypes, SecuritySeverity } from '../../lib/security-enhanced';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Log the security monitoring access
    await logSecurityEvent(
      null,
      {
        eventType: SecurityEventTypes.SUSPICIOUS_ACTIVITY,
        severity: SecuritySeverity.LOW,
        description: 'Security dashboard accessed',
        metadata: { endpoint: '/api/security-monitor' }
      },
      ipAddress,
      userAgent
    );

    // Get security dashboard data
    const { data: securityData, error: securityError } = await supabase
      .from('security_dashboard')
      .select('*');

    if (securityError) {
      console.error('Error fetching security data:', securityError);
      return res.status(500).json({ error: 'Failed to fetch security data' });
    }

    // Get recent security events
    const { data: recentEvents, error: eventsError } = await supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (eventsError) {
      console.error('Error fetching recent events:', eventsError);
    }

    // Get suspicious activities
    const { data: suspiciousActivities, error: suspiciousError } = await supabase
      .from('suspicious_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (suspiciousError) {
      console.error('Error fetching suspicious activities:', suspiciousError);
    }

    // Get blocked IPs
    const { data: blockedIps, error: blockedError } = await supabase
      .from('failed_login_attempts')
      .select('*')
      .eq('is_blocked', true)
      .gt('blocked_until', new Date().toISOString());

    if (blockedError) {
      console.error('Error fetching blocked IPs:', blockedError);
    }

    const response = {
      timestamp: new Date().toISOString(),
      securityMetrics: securityData || [],
      recentEvents: recentEvents || [],
      suspiciousActivities: suspiciousActivities || [],
      blockedIps: blockedIps || [],
      summary: {
        totalSecurityEvents: recentEvents?.length || 0,
        highRiskActivities: suspiciousActivities?.filter(a => a.risk_score > 75).length || 0,
        currentlyBlockedIps: blockedIps?.length || 0
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Security monitoring error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
