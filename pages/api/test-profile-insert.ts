import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test profile insertion with minimal data
    // Generate a proper UUID format
    const testId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: testId,
        name: 'Test User'
      })
      .select();

    if (error) {
      console.error('Profile insert error:', error);
      return res.status(500).json({ 
        error: 'Profile insert failed', 
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    // Clean up the test record
    await supabase.from('profiles').delete().eq('id', testId);

    res.status(200).json({ 
      message: 'Profile insert successful',
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
