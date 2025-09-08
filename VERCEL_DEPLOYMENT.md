# Vercel Deployment Guide

## Required Environment Variables

You only need to set up these environment variables in Vercel:

### 1. Supabase (Already configured)
- `NEXT_PUBLIC_SUPABASE_URL` = `https://gjpaeyimzwmooiansfrp.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcGFleWltendtb29pYW5zZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTcwNzgsImV4cCI6MjA3MjkzMzA3OH0.ImjDlMoFGg9VpRfisHHl8ZmZ9vFOkLp8pLrr-ENrYFQ`

### 2. Stripe (For payments - you need to add these)
- `STRIPE_SECRET_KEY` = Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Your Stripe publishable key (starts with `pk_test_` or `pk_live_`)

## Steps to Deploy:

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Go to "Environment Variables"
   - Add the 4 variables above
3. **Deploy!**

## What's NOT needed:
- ❌ `OPENAI_API_KEY` - We're not using AI features yet
- ❌ Email configuration - Optional for later

## Current Features:
- ✅ Authentication (Supabase)
- ✅ Premium invoice builder with PDF generation
- ✅ Payment processing (Stripe)
- ✅ Professional UI with templates
- ✅ Database integration (Supabase)

## To get Stripe keys:
1. Go to https://stripe.com
2. Create account or login
3. Go to "Developers" → "API keys"
4. Copy your keys and add them to Vercel environment variables
