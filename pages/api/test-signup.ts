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

    // Test Supabase signup
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
        error: 'Signup failed', 
        details: error.message
      });
    }

    // If signup was successful and we have a user, create the profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: name
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return res.status(500).json({ 
          error: 'Database error saving new user',
          details: profileError.message,
          code: profileError.code
        });
      }
    }

    res.status(200).json({ 
      message: 'Signup successful',
      user: data.user ? { id: data.user.id, email: data.user.email } : null
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ 
      error: 'Signup failed', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
