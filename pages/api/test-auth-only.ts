import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Test only Supabase auth signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);
      return res.status(400).json({ 
        error: 'Auth signup failed', 
        details: error.message,
        code: error.status,
        fullError: error
      });
    }

    res.status(200).json({ 
      message: 'Auth signup successful',
      user: data.user ? { 
        id: data.user.id, 
        email: data.user.email,
        idType: typeof data.user.id,
        idLength: data.user.id.length
      } : null,
      session: data.session ? 'Session created' : 'No session'
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ 
      error: 'Signup failed', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
