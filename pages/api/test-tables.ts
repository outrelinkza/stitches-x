import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test if profiles table exists and get its structure
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Profiles table error:', error);
      return res.status(500).json({ 
        error: 'Profiles table issue', 
        details: error.message,
        code: error.code
      });
    }
    
    res.status(200).json({ 
      message: 'Profiles table accessible',
      sampleData: data
    });
  } catch (err) {
    console.error('Test error:', err);
    res.status(500).json({ 
      error: 'Test failed', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
