import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Supabase connection failed', 
        details: error.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      });
    }
    
    res.status(200).json({ 
      message: 'Supabase connection successful',
      data: data
    });
  } catch (err) {
    console.error('Test error:', err);
    res.status(500).json({ 
      error: 'Test failed', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
