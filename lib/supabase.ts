import { createClient } from '@supabase/supabase-js'

// Use your actual Supabase credentials or fallback to a dummy client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gjpaeyimzwmooiansfrp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcGFleWltendtb29pYW5zZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTcwNzgsImV4cCI6MjA3MjkzMzA3OH0.ImjDlMoFGg9VpRfisHHl8ZmZ9vFOkLp8pLrr-ENrYFQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  name: string
  company_name?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  user_id: string
  invoice_number: string
  client_name: string
  client_email: string
  client_address?: string
  company_name: string
  company_address?: string
  items: any[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  created_at: string
  updated_at: string
}
