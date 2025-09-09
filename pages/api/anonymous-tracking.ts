import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action } = req.body;

    if (action === 'check_limit') {
      return res.json({
        canDownload: true,
        downloadsUsed: 0,
        limit: 1,
        cooldownExpired: true,
        lastActivity: null
      });
    }

    if (action === 'track_download') {
      return res.json({ 
        success: true, 
        downloadsUsed: 1,
        limit: 1,
        message: 'Download tracked successfully'
      });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('Error in anonymous tracking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}