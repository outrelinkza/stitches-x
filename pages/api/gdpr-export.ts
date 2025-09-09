import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { sanitizeInput, logSecurityEvent } from '../../lib/security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { email, requestType } = sanitizedBody;

    // Validate required fields
    if (!email || !requestType) {
      return res.status(400).json({ error: 'Email and request type are required' });
    }

    // Validate request type
    const validRequestTypes = ['data_export', 'data_deletion', 'data_rectification'];
    if (!validRequestTypes.includes(requestType)) {
      return res.status(400).json({ error: 'Invalid request type' });
    }

    // Log the GDPR request
    logSecurityEvent('GDPR_REQUEST', { 
      email, 
      requestType, 
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress 
    }, req);

    // For data export requests, gather user data
    if (requestType === 'data_export') {
      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', email) // Assuming email is used as user identifier
        .single();

      // Get user activity data
      const { data: activity, error: activityError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', email);

      // Get anonymous usage data (if any)
      const { data: anonymousUsage, error: anonymousError } = await supabase
        .from('anonymous_usage')
        .select('*')
        .eq('ip_address', req.headers['x-forwarded-for'] || req.connection.remoteAddress);

      const exportData = {
        requestDate: new Date().toISOString(),
        requestType: 'data_export',
        userEmail: email,
        profileData: profile || null,
        activityData: activity || [],
        anonymousUsageData: anonymousUsage || [],
        dataCategories: {
          accountInformation: profile ? {
            name: profile.name,
            companyName: profile.company_name,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            zipCode: profile.zip_code,
            country: profile.country,
            website: profile.website,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at
          } : null,
          usageData: {
            freeDownloadsUsed: profile?.free_downloads_used || 0,
            isPremium: profile?.is_premium || false,
            activityLog: activity || []
          },
          systemData: {
            ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            lastActivity: profile?.updated_at
          }
        }
      };

      // Store the export request
      const { error: storeError } = await supabase
        .from('user_activity')
        .insert({
          user_id: email,
          action: 'gdpr_data_export_request',
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          user_agent: req.headers['user-agent'],
          created_at: new Date().toISOString()
        });

      if (storeError) {
        console.error('Error storing GDPR request:', storeError);
      }

      return res.status(200).json({
        success: true,
        message: 'Data export request received. You will receive your data within 30 days.',
        requestId: `GDPR-${Date.now()}`,
        data: exportData
      });
    }

    // For data deletion requests
    if (requestType === 'data_deletion') {
      // Store the deletion request
      const { error: storeError } = await supabase
        .from('user_activity')
        .insert({
          user_id: email,
          action: 'gdpr_data_deletion_request',
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          user_agent: req.headers['user-agent'],
          created_at: new Date().toISOString()
        });

      if (storeError) {
        console.error('Error storing GDPR request:', storeError);
      }

      return res.status(200).json({
        success: true,
        message: 'Data deletion request received. Your data will be deleted within 30 days.',
        requestId: `GDPR-DEL-${Date.now()}`
      });
    }

    // For data rectification requests
    if (requestType === 'data_rectification') {
      // Store the rectification request
      const { error: storeError } = await supabase
        .from('user_activity')
        .insert({
          user_id: email,
          action: 'gdpr_data_rectification_request',
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          user_agent: req.headers['user-agent'],
          created_at: new Date().toISOString()
        });

      if (storeError) {
        console.error('Error storing GDPR request:', storeError);
      }

      return res.status(200).json({
        success: true,
        message: 'Data rectification request received. We will contact you within 30 days.',
        requestId: `GDPR-RECT-${Date.now()}`
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('GDPR_API_ERROR', { error: errorMessage }, req);
    console.error('Error in GDPR export:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
